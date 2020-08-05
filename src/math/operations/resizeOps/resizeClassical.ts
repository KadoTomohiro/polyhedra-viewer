import { Classical, Facet, twists, oppositeTwist } from "specs"
import { makeOpPair, OpPairInput, GraphOpts } from "../operationPairs"
import {
  getTransformedVertices,
  FacetOpts,
  TwistOpts,
  Pose,
} from "../operationUtils"
import ClassicalForme from "math/formes/ClassicalForme"

/**
 * Return the expanded vertices of the polyhedron resized to the given distance-from-center
 * and rotated by the given angle
 *
 * @param faces the faces to transform
 * @param distance the normalized distance from center to put those faces
 * @param angle the angle to twist the faces by
 */
function getResizedVertices(
  forme: ClassicalForme,
  facet: Facet,
  result: Classical,
) {
  const resultForme = ClassicalForme.fromSpecs(result)
  const angle = forme.snubAngle(facet)
  const distance = resultForme.inradius(facet) / resultForme.geom.edgeLength()
  const scale = forme.geom.edgeLength() * distance - forme.inradius(facet)
  return getTransformedVertices(forme.facetFaces(facet), (f) => {
    const rotateM = f.rotateNormal(angle)
    const translateM = f.translateNormal(scale)
    return f.withCentroidOrigin(rotateM.premultiply(translateM))
  })
}

function getClassicalPose(forme: ClassicalForme, facet: Facet): Pose {
  const { geom } = forme
  return {
    // Always centered on centroid
    origin: geom.centroid(),
    // Use the normal of the given face as the first axis
    scale: geom.edgeLength(),
    orientation: forme
      .adjacentFacetFaces(facet)
      .map((face) => face.normal()) as any,
  }
}

type ResizeArgs<L, R> = Omit<OpPairInput<ClassicalForme, L, R>, "graph">

function getResizeArgs<L, R>(
  getFacet: (opts: GraphOpts<L, R>) => Facet,
): ResizeArgs<L, R> {
  return {
    middle: "right",
    getPose(pos, forme, options) {
      return getClassicalPose(forme, getFacet(options))
    },
    toLeft(forme, options, result) {
      return getResizedVertices(forme, getFacet(options), result)
    },
  }
}

const resizeArgs = getResizeArgs<{}, FacetOpts>((opts) => opts.right.facet)

// Expansion of truncated to bevelled solids
export const semiExpand = makeOpPair<ClassicalForme, {}, FacetOpts>({
  ...resizeArgs,
  graph: function* () {
    for (const entry of Classical.allWithOperation("truncate")) {
      yield {
        left: entry,
        right: entry.withOperation("bevel"),
        options: { left: {}, right: { facet: entry.facet() } },
      }
    }
  },
})

export const expand = makeOpPair<ClassicalForme, {}, FacetOpts>({
  ...resizeArgs,
  graph: function* () {
    for (const entry of Classical.allWithOperation("regular")) {
      yield {
        left: entry,
        right: entry.withOperation("cantellate"),
        options: { left: {}, right: { facet: entry.facet() } },
      }
    }
  },
})

export const snub = makeOpPair<ClassicalForme, TwistOpts, FacetOpts>({
  ...resizeArgs,
  graph: function* () {
    for (const entry of Classical.allWithOperation("regular")) {
      for (const twist of twists) {
        yield {
          left: entry,
          // If a vertex-solid, the chirality of the result
          // is *opposite* of the twist option
          right: entry.withOperation(
            "snub",
            entry.isVertex() ? oppositeTwist(twist) : twist,
          ),
          options: { left: { twist }, right: { facet: entry.facet() } },
        }
      }
    }
  },
})

export const twist = makeOpPair<ClassicalForme, TwistOpts, {}>({
  ...getResizeArgs(() => "face"),
  graph: function* () {
    for (const entry of Classical.allWithOperation("cantellate")) {
      for (const twist of twists) {
        yield {
          left: entry,
          right: entry.withOperation("snub", twist),
          options: { left: { twist }, right: {} },
        }
      }
    }
  },
})