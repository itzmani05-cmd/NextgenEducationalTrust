// Server-side mirror of src/utils/scholarshipCalc.js, operating on the stored
// Application row rather than in-progress wizard state. Kept authoritative
// here so `calculatedConcession` can never be set from a client-sent value.

const INCOME_BASED_KEYS = ['income_1', 'income_2', 'income_3', 'income_4']

// Tiered bonus based on the average of 10th & 12th percentage:
// ≥80% -> +5%, 60-79.99% -> +3%, 50-59.99% -> +1%, <50% -> +0%.
function tenthTwelfthBonus(tenthPct, twelfthPct) {
  const a = parseFloat(tenthPct)
  const b = parseFloat(twelfthPct)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  const avg = (a + b) / 2
  if (avg >= 80) return 5
  if (avg >= 60) return 3
  if (avg >= 50) return 1
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
      return { key: 'income_1', label: 'Category 3 — Income Tier 1', base: 50, cap: 50 }
    case '1_5_to_3':
      return { key: 'income_2', label: 'Category 3 — Income Tier 2', base: 40, cap: 50 }
    case '3_to_5':
      return { key: 'income_3', label: 'Category 3 — Income Tier 3', base: 25, cap: 50 }
    case 'above_5':
      return { key: 'income_4', label: 'Category 4 — Standard Fee', base: 0, cap: 25 }
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

    if (app.selfEarning === 'yes') {
      additions.push({ label: 'Financial Self-Support', value: 5 })
    }
    const academic = tenthTwelfthBonus(app.tenth?.percentage, app.twelfth?.percentage)
    if (academic > 0) {
      additions.push({ label: 'Academic Performance (10th & 12th)', value: academic })
    }
    if (app.tamilMediumTill12 === 'yes') {
      additions.push({ label: 'Tamil Medium', value: 5 })
    }
    if (bothGovtSchool) {
      additions.push({ label: 'Government School', value: 5 })
    }
    if (app.socialCategory === 'SC/ST' && app.communityCertificateUrl) {
      additions.push({ label: 'SC/ST', value: 5 })
    }
  }

  const additionsTotal = additions.reduce((sum, a) => sum + a.value, 0)
  const calculated = category.base + additionsTotal
  const provisional = Math.min(calculated, category.cap)

  return { category, base: category.base, additions, calculated, cap: category.cap, provisional }
}
