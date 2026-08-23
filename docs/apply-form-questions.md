# Scholarship Application — Full Question List

This is every question actually asked in the live `/apply` flow (6 steps), in the order
the applicant sees them, generated from the current form code. Required fields are
marked **(required)**; fields that only appear based on an earlier answer are marked
**(conditional)** with the trigger noted.

---

## Step 1 — Student Details

| Field | Notes |
|---|---|
| Which Course Are You Applying For? | **(required)** SDP - State Govt Exam / SDP - Central Govt Exam / SDP - Gate Exam. "SDP" (Skill Development Program) is shown as a hover-tooltip abbreviation. Sets the application's exam category/name used later in admin review and certificate numbering. |
| Full Name | **(required)** Pre-filled from the applicant's Google account, but editable. Shown with the example "e.g. Manikandan K. — ends with initial" |
| Date of Birth | **(required)** |
| Gender | **(required)** Male / Female / Other |
| Mobile Number | **(required)** |
| Email | **(required)** Locked — pulled from the applicant's Google account |
| Door No. | **(required)** |
| Street | **(required)** |
| Place | **(required)** |
| Pincode | **(required)** |
| District | **(required)** Dropdown of all Tamil Nadu districts + "Other" |

---

## Step 2 — Family & Financial Details

### Parent & Guardian Details
| Field | Notes |
|---|---|
| Father's Name | Optional |
| Father's Occupation | Optional |
| Father's Contact | Optional |
| Mother's Name | Optional |
| Mother's Occupation | Optional |
| Mother's Contact | Optional |
| Guardian's Name | Optional — "if applicable" |
| Relation to Guardian | Optional |
| Guardian's Contact | Optional |
| Parent Status | **(required)** Both Parents Living / Single Parent / No Living Parents / Under Legal Guardian |

### Family Circumstances (conditional on Parent Status above)
| Field | Notes |
|---|---|
| Father's Death Certificate (upload) | **(conditional — required if Parent Status = No Living Parents)** |
| Mother's Death Certificate (upload) | **(conditional — required if Parent Status = No Living Parents)** |
| Supporting Parent | **(conditional — required if Parent Status = Single Parent)** Father / Mother / Legal Guardian |
| Supporting Document (upload) | **(conditional — required if Parent Status = Single Parent)** Proof of single-parent status |

### Annual Household Income
| Field | Notes |
|---|---|
| Annual Household Income tier | **(required)** Up to ₹1,50,000 / ₹1,50,001–₹3,00,000 / ₹3,00,001–₹5,00,000 / Above ₹5,00,000 |
| Government-issued Income Certificate (upload) | **(required)** |

### Educational Expenses
| Field | Notes |
|---|---|
| Who primarily bears your educational/coaching expenses? | **(required)** Parents/Guardian fully / Parents/Guardian partially / I bear my expenses myself / I and my family share expenses / Other |

### Financial Independence
| Field | Notes |
|---|---|
| Are you currently earning an income to support your education or family? | **(required)** Yes / No |
| Employment Type | **(conditional — required if above = Yes)** Full-time / Part-time / Self-employed / Freelance-Gig / Other |
| Approximate Monthly Income (₹) | **(conditional — required if above = Yes)** |

### Social Category
| Field | Notes |
|---|---|
| Do you belong to the Scheduled Caste category? | **(required)** Scheduled Caste / Not Scheduled Caste |
| Valid Community Certificate (upload) | **(conditional — required if Scheduled Caste)** |

---

## Step 3 — Educational Details

### 10th Standard
| Field | Notes |
|---|---|
| School Name | **(required)** |
| Percentage | **(required)** |
| Where did you study 10th? | **(required)** Government School / Government Aided / Private / Other |
| 10th Mark Sheet (upload) | **(required)** |

### 12th Standard
| Field | Notes |
|---|---|
| School Name | **(required)** |
| Percentage | **(required)** |
| Where did you study 12th? | **(required)** Government School / Government Aided / Private / Other |
| 12th Mark Sheet (upload) | **(required)** |
| Government School Evidence (upload) | **(conditional, optional — shown if both 10th and 12th were Government School)** e.g. school transfer certificate |

### Current College / Institution
| Field | Notes |
|---|---|
| College / Institution Name | **(required)** |
| Register / Roll Number | **(required)** |
| Institution Type | **(required)** Government / Government-Aided / Private-Self-Financing / Autonomous / Deemed University / Other |
| College Address | **(required)** |
| Degree / Course | **(required)** |
| Branch / Specialization | Optional |
| Current Year | **(required)** Dropdown — Year 1 to Year 5 |
| Current Semester | Optional — Dropdown — Semester 1 to Semester 10 |
| Academic Year | **(required)** e.g. 2025-2026 |
| Expected Graduation Year | Optional |
| Current CGPA / Percentage | **(required)** |
| Latest College Mark Sheet (upload) | **(required)** |

### Existing Scholarships / Financial Assistance
Only reached once the applicant has already provided their college details above.

| Field | Notes |
|---|---|
| Are you currently receiving any Government scholarship or other educational financial assistance? | **(required)** Yes / No |
| Scholarship Name | **(conditional — required if above = Yes)** |
| Provider | **(conditional — required if above = Yes)** |
| Amount (₹) | **(conditional, optional)** |
| Academic Year | **(conditional, optional)** e.g. 2025-2026 |
| Supporting Document (upload) | **(conditional — required if above = Yes)** |

### Academic Performance
| Field | Notes |
|---|---|
| Do you hold a Diploma qualification? | Yes / No |
| Diploma Percentage | **(conditional — required if above = Yes)** |
| Diploma Mark Sheet (upload) | **(conditional — required if above = Yes)** |
| Latest Academic Percentage | **(conditional — required if above = Yes)** |

### Medium of Instruction
| Field | Notes |
|---|---|
| What was your medium of instruction? | **(required)** Tamil / English / Other |
| Did you study in Tamil Medium up to 10th / 12th? | Yes / No |
| Tamil Medium Evidence (upload) | **(conditional — required if above = Yes)** Bonafide certificate or mark sheet indicating medium of instruction |

---

## Step 4 — Documents

All documents required from every applicant, or conditionally based on earlier answers,
are collected together on this step.

**Basic documents (every applicant):**
1. Student Photograph
2. Identity Document
3. 10th Mark Sheet
4. 12th Mark Sheet
5. Latest College Mark Sheet

**Additional documents (only shown if applicable):**
- Father's Death Certificate — if both parents deceased
- Mother's Death Certificate — if both parents deceased
- Single-Parent Supporting Proof — if single-parent household
- Income Certificate — every applicant
- Diploma Mark Sheet — if diploma held
- Tamil-Medium Evidence — if Tamil medium through 10th/12th
- Government-School Evidence — if both 10th and 12th were government schools
- Community Certificate — if Scheduled Caste
- Financial Self-Support Evidence — if self-earning
- Existing Scholarship Proof — if already receiving another scholarship

---

## Step 5 — Summary

No new questions — a read-only review of everything entered so far, with "Edit" links
back to each section.

## Step 6 — Declaration

| Field | Notes |
|---|---|
| Declaration checkbox | **(required)** "I confirm that the information and documents provided by me are true and accurate. I understand that the final concession is subject to verification and approval by the Trust." Must be checked to submit. |

---

*Generated from the live application form code in `src/components/apply/steps/` and
`src/utils/documentChecklist.js`. If the form changes, re-generate this list rather than
editing it by hand, so it stays in sync with what applicants actually see.*
