import KDBush from "kdbush";
import * as Vec2 from "vec2";
import { random } from "./Utilities";

export default class Network {
  constructor(ctx, width, height, bgImg) {
    this.ctx = ctx;
    this.bgImg = bgImg;
    this.width = width;
    this.height = height;
    this.attractors = []; // attractors influence node growth
    this.nodes = []; // nodes are connected to form branches

    this.bounds = [];
    this.obstacles = [];

    this.backgroundColour = "rgba(0,0,0,0.85)";
    this.showNodes = true;
    this.venationType = "open";
    this.enableCanalization = true;
    this.killDistance = 5;
    this.attractionDistance = 25;

    this.buildSpatialIndices();
  }

  update(isPaused) {
    if (isPaused) return;

    // Associate attractors with nearby nodes to figure out where growth should occur
    for (let [attractorID, attractor] of this.attractors.entries()) {
      switch (this.venationType) {
        // For open venation, only associate this attractor with its closest node
        case "open":
          let closestNode = this.getClosestNode(
            attractor,
            this.getNodesInAttractionZone(attractor)
          );

          if (closestNode != null) {
            closestNode.influencedBy.push(attractorID);
            attractor.influencingNodes = [closestNode];
          }

          break;

        // For closed venation, associate this attractor with all nodes in its relative neighborhood
        case "closed":
          let neighborhoodNodes = this.getRelativeNeighborNodes(attractor);
          let nodesInKillZone = this.getNodesInKillZone(attractor);

          // Exclude nodes that are in the attractor's kill zone (these should stop growing)
          let nodesToGrow = neighborhoodNodes.filter((neighborNode) => {
            return !nodesInKillZone.includes(neighborNode);
          });

          attractor.influencingNodes = neighborhoodNodes;

          if (nodesToGrow.length > 0) {
            attractor.fresh = false;

            for (let node of nodesToGrow) {
              node.influencedBy.push(attractorID);
            }
          }

          break;

        default:
          break;
      }
    }

    // Grow the network by adding new nodes onto any nodes being influenced by attractors
    for (let node of this.nodes) {
      if (node.influencedBy.length > 0) {
        let averageDirection = this.getAverageDirection(
          node,
          node.influencedBy.map((id) => this.attractors[id])
        );
        let nextNode = node.getNextNode(averageDirection);
        let isInsideAnyBounds = false;
        let isInsideAnyObstacle = false;

        // Only allow root nodes inside of defined bounds
        if (this.bounds !== undefined && this.bounds.length > 0) {
          for (let bound of this.bounds) {
            if (bound.contains(nextNode.position.x, nextNode.position.y)) {
              isInsideAnyBounds = true;
            }
          }
        }

        // Don't allow any root nodes that are inside of an obstacle
        if (this.obstacles !== undefined && this.obstacles.length > 0) {
          for (let obstacle of this.obstacles) {
            if (obstacle.contains(nextNode.position.x, nextNode.position.y)) {
              isInsideAnyObstacle = true;
            }
          }
        }

        // NOTE: disabling this check lets nodes grow across gaps in bounds - cool effect!
        if (
          (isInsideAnyBounds || this.bounds.length === 0) &&
          (!isInsideAnyObstacle || this.obstacles.length === 0)
        ) {
          this.nodes.push(nextNode);
        }
      }

      node.influencedBy = [];

      // Perform auxin flux canalization (line segment thickening)
      if (node.isTip && this.enableCanalization) {
        let currentNode = node;

        while (currentNode.parent !== null) {
          // When there are multiple child nodes, use the thickest of them all
          if (currentNode.parent.thickness < currentNode.thickness + 0.07) {
            currentNode.parent.thickness = currentNode.thickness + 0.03;
          }

          currentNode = currentNode.parent;
        }
      }
    }

    // Remove any attractors that have been reached by their associated nodes
    for (let [attractorID, attractor] of this.attractors.entries()) {
      if (this.venationType === "open") {
        // For open venation, remove the attractor as soon as any node reaches it
        if (attractor.reached) {
          this.attractors.splice(attractorID, 1);
        }
      }

      // For closed venation, remove the attractor only when all associated nodes have reached it
      else {
        if (attractor.influencingNodes.length > 0 && !attractor.fresh) {
          let allNodesReached = true;

          for (let node of attractor.influencingNodes) {
            if (
              node.position.distance(attractor.position) > this.killDistance
            ) {
              allNodesReached = false;
            }
          }

          if (allNodesReached) {
            this.attractors.splice(attractorID, 1);
          }
        }
      }
    }

    // Rebuild spatial indices
    this.buildSpatialIndices();
  }

  draw() {
    this.drawBackground();
    // this.ctx.globalCompositeOperation = "lighter";
    this.drawNodes();
  }

  drawBgImage() {
    this.ctx.drawImage(this.bgImg, 0, 0);
  }

  drawBackground() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawBgImage();

    this.ctx.beginPath();
    this.ctx.fillStyle = this.backgroundColour;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawNodes() {
    if (this.showNodes) {
      for (let node of this.nodes) {
        node.draw();
      }
    }
  }

  getRelativeNeighborNodes(attractor) {
    let fail;

    let nearbyNodes = this.getNodesInAttractionZone(attractor);
    let relativeNeighbors = [];
    let attractorToP0, attractorToP1, p0ToP1;

    // p0 is a relative neighbor of auxinPos iff
    // for any point p1 that is closer to auxinPos than is p0,
    // p0 is closer to auxinPos than to p1
    for (let p0 of nearbyNodes) {
      fail = false;
      attractorToP0 = p0.position.subtract(attractor.position, true);

      for (let p1 of nearbyNodes) {
        if (p0 === p1) {
          continue;
        }

        attractorToP1 = p1.position.subtract(attractor.position, true);

        if (attractorToP1.length() > attractorToP0.length()) {
          continue;
        }

        p0ToP1 = p1.position.subtract(p0.position, true);

        if (attractorToP0.length() > p0ToP1.length()) {
          fail = true;
          break;
        }
      }

      if (!fail) {
        relativeNeighbors.push(p0);
      }
    }

    return relativeNeighbors;
  }

  getNodesInAttractionZone(attractor) {
    return this.nodesIndex
      .within(
        attractor.position.x,
        attractor.position.y,
        this.attractionDistance
      )
      .map((id) => this.nodes[id]);
  }

  getNodesInKillZone(attractor) {
    return this.nodesIndex
      .within(attractor.position.x, attractor.position.y, this.killDistance)
      .map((id) => this.nodes[id]);
  }

  getClosestNode(attractor, nearbyNodes) {
    let closestNode = null,
      record = this.attractionDistance;

    for (let node of nearbyNodes) {
      let distance = node.position.distance(attractor.position);

      if (distance < this.killDistance) {
        attractor.reached = true;
        closestNode = null;
      } else if (distance < record) {
        closestNode = node;
        record = distance;
      }
    }

    return closestNode;
  }

  getAverageDirection(node, nearbyattractors) {
    // Add up normalized vectors pointing to each attractor
    let averageDirection = new Vec2(0, 0);

    for (let attractor of nearbyattractors) {
      averageDirection.add(
        attractor.position.subtract(node.position, true).normalize()
      );
    }

    // Add small amount of random "jitter" to avoid getting stuck between two attractors and endlessly generating nodes in the same place
    // (Credit to Davide Prati (edap) for the idea, seen in ofxSpaceColonization)
    averageDirection
      .add(new Vec2(random(-0.1, 0.1), random(-0.1, 0.1)))
      .normalize();

    averageDirection.divide(node.influencedBy.length).normalize();

    return averageDirection;
  }

  addNode(node) {
    let isInsideAnyBounds = false;
    let isInsideAnyObstacle = false;

    // Only allow root nodes inside of defined bounds
    if (this.bounds !== undefined && this.bounds.length > 0) {
      for (let bound of this.bounds) {
        if (bound.contains(node.position.x, node.position.y)) {
          isInsideAnyBounds = true;
        }
      }
    }

    // Don't allow any root nodes that are inside of an obstacle
    if (this.obstacles !== undefined && this.obstacles.length > 0) {
      for (let obstacle of this.obstacles) {
        if (obstacle.contains(node.position.x, node.position.y)) {
          isInsideAnyObstacle = true;
        }
      }
    }

    if (
      (isInsideAnyBounds || this.bounds.length === 0) &&
      (!isInsideAnyObstacle || this.obstacles.length === 0)
    ) {
      this.nodes.push(node);
      this.buildSpatialIndices();
    }
  }

  reset() {
    this.nodes = [];
    this.attractors = [];

    this.buildSpatialIndices();
  }

  buildSpatialIndices() {
    this.nodesIndex = new KDBush(
      this.nodes,
      (p) => p.position.x,
      (p) => p.position.y
    );
  }
}
