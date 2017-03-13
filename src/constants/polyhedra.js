import _ from 'lodash'

const getPolyhedra = groupName => require(`../data/groups/${groupName}.json`)

/* Johnson Solid Subgroups */
const johnsonSolids = getPolyhedra('johnson')
const johnsonSubgroups = require('../data/johnsonSubgroups.json')
const getEndIndex = i => i === johnsonSubgroups.length - 1 ? 92 : johnsonSubgroups[i+1].index
const getJohnsonPolyhedra = () => {
  return johnsonSubgroups.map(({ name, index }, i) => ({
    name,
    polyhedra: johnsonSolids.slice(index, getEndIndex(i))
  }))
}

const getNestedPolyhedra = groupName => {
  if (groupName === 'johnson') return { groups: getJohnsonPolyhedra() }
  return { polyhedra: getPolyhedra(groupName) }
}

const groupData = require('../data/groups.json')

const flatGroups = groupData.map(group => ({
  ...group,
  polyhedra: getPolyhedra(group.name),
}))

export const groups = groupData.map(group => ({
  ...group,
  ...getNestedPolyhedra(group.name),
}))

const allSolidNames = _.flatMap(flatGroups, 'polyhedra')

export const isValidSolid = escapedSolidName => {
  return allSolidNames.includes(escapedSolidName.replace(/-/g, ' '))
}

export const getSolidData = escapedSolidName => {
  return require(`../data/polyhedra/${escapedSolidName}.json`)
}

export const escapeName = name => name.replace(/ /g, '-');
