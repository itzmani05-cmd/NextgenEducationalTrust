// Flat +5% if the average of 10th & 12th percentage is excellent (≥80%) —
// deliberately a high bar since, unlike the old tiered version, this is an
// all-or-nothing bonus rather than a scaled one.
export function tenthTwelfthBonus(tenthPct, twelfthPct) {
  const a = parseFloat(tenthPct)
  const b = parseFloat(twelfthPct)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  const avg = (a + b) / 2
  return avg >= 80 ? 5 : 0
}

// The 5 options the Trust chooses between when recording a final concession
// decision (see AdminApplicationDetail.jsx) — shared here so the student-facing
// status page can render the same label for whichever category was approved.
export const CONCESSION_LABELS = {
  category1: 'Category 1 — Orphan',
  category2: 'Category 2 — Single Parent',
  category3: 'Category 3 — Economically Needy',
  category4: 'Category 4 — Standard Fee',
  exceptional: 'Exceptional Hardship',
}

// Categories 1, 2, and 4 are flat — no additional factors apply, only
// Category 3 (income-based) stacks the additional factors below, capped at 50%.
const INCOME_BASED_KEYS = ['income_1', 'income_2', 'income_3']

export function getCategory(data) {
  if (data.bothParentsDeceased === 'yes') {
    return { key: 'orphan', label: 'Category 1 — Orphan', base: 100, cap: 100 }
  }
  if (data.singleParent === 'yes') {
    return { key: 'single_parent', label: 'Category 2 — Single Parent', base: 50, cap: 50 }
  }
  switch (data.annualIncome) {
    case 'upto_1_5':
      return { key: 'income_1', label: 'Category 3 — Income Tier 1', base: 50, cap: 50 }
    case '1_5_to_3':
      return { key: 'income_2', label: 'Category 3 — Income Tier 2', base: 40, cap: 50 }
    case '3_to_5':
      return { key: 'income_3', label: 'Category 3 — Income Tier 3', base: 25, cap: 50 }
    case 'above_5':
      return { key: 'income_4', label: 'Category 4 — Standard Fee', base: 0, cap: 0 }
    default:
      return { key: 'pending', label: 'Awaiting Selection', base: 0, cap: 0 }
  }
}

export function getProvisional(data) {
  const category = getCategory(data)
  const isIncomeBased = INCOME_BASED_KEYS.includes(category.key)
  const additions = []

  if (isIncomeBased) {
    const bothGovtSchool =
      data.tenth?.schoolType === 'government' && data.twelfth?.schoolType === 'government'

    if (data.selfEarning === 'yes') {
      additions.push({ label: 'Financial Self-Support', value: 5 })
    }
    const academic = tenthTwelfthBonus(data.tenth?.percentage, data.twelfth?.percentage)
    if (academic > 0) {
      additions.push({ label: 'Academic Performance (10th & 12th)', value: academic })
    }
    if (data.tamilMediumTill12 === 'yes') {
      additions.push({ label: 'Tamil Medium', value: 5 })
    }
    if (bothGovtSchool) {
      additions.push({ label: 'Government School', value: 5 })
    }
    // Wizard state holds a File under `communityCertificate`; the stored
    // application row holds its uploaded path under `communityCertificateUrl`.
    const hasCommunityCert = Boolean(data.communityCertificate || data.communityCertificateUrl)
    const isScSt = ['SC', 'ST', 'SC(A)'].includes(data.socialCategory)
    if (isScSt && hasCommunityCert) {
      additions.push({ label: 'SC/ST/SC(A)', value: 5 })
    }
  }

  const additionsTotal = additions.reduce((sum, a) => sum + a.value, 0)
  const calculated = category.base + additionsTotal
  const provisional = Math.min(calculated, category.cap)

  return {
    category,
    base: category.base,
    additions,
    calculated,
    cap: category.cap,
    provisional,
  }
}
