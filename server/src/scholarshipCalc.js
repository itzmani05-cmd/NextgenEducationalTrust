// Server-side mirror of src/utils/scholarshipCalc.js, operating on the stored
// Application row rather than in-progress wizard state. Kept authoritative
// here so `calculatedConcession` can never be set from a client-sent value.

const INCOME_BASED_KEYS = ['income_1', 'income_2', 'income_3']

function academicBonus(pct) {
  const n = parseFloat(pct)
  if (Number.isNaN(n)) return 0
  if (n >= 80) return 5
  if (n >= 60) return 3
  if (n >= 50) return 1
  return 0
}

function getCategory(app) {
  if (app.bothParentsDeceased === 'yes') {
    return { key: 'orphan', label: 'Category 1 — Orphan', base: 100, cap: 100 }
  }
  if (app.singleParent === 'yes') {
    return { key: 'single_parent', label: 'Category 2 — Single Parent', base: 50, cap: 50 }
  }
  switch (app.annualIncome) {
    case 'upto_1_5':
      return { key: 'income_1', label: 'Category 3 — Income Tier 1', base: 75, cap: 75 }
    case '1_5_to_3':
      return { key: 'income_2', label: 'Category 3 — Income Tier 2', base: 50, cap: 75 }
    case '3_to_5':
      return { key: 'income_3', label: 'Category 3 — Income Tier 3', base: 25, cap: 75 }
    case 'above_5':
      return { key: 'income_4', label: 'Category 4 — Standard Fee', base: 0, cap: 0 }
    default:
      return { key: 'pending', label: 'Awaiting Selection', base: 0, cap: 0 }
  }
}

export function getProvisional(app) {
  const category = getCategory(app)
  const isIncomeBased = INCOME_BASED_KEYS.includes(category.key)
  const additions = []

  if (isIncomeBased) {
    const bothGovtSchool =
      app.tenth?.schoolType === 'government' && app.twelfth?.schoolType === 'government'

    if (app.selfEarning === 'yes' && app.supportsDependents === 'yes') {
      additions.push({ label: 'Financial Self-Support', value: 10 })
    }
    const academic = academicBonus(app.latestAcademicPercentage)
    if (academic > 0) {
      additions.push({ label: 'Academic Performance', value: academic })
    }
    if (app.tamilMediumTill12 === 'yes') {
      additions.push({ label: 'Tamil Medium', value: 5 })
    }
    if (bothGovtSchool) {
      additions.push({ label: 'Government School', value: 5 })
    }
    if ((app.socialCategory === 'SC' || app.socialCategory === 'ST') && app.communityCertificateUrl) {
      additions.push({ label: 'SC/ST', value: 5 })
    }
  }

  const additionsTotal = additions.reduce((sum, a) => sum + a.value, 0)
  const calculated = category.base + additionsTotal
  const provisional = Math.min(calculated, category.cap)

  return { category, base: category.base, additions, calculated, cap: category.cap, provisional }
}
