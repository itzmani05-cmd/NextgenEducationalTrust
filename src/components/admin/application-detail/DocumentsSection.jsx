import Section from './Section.jsx'
import DocRow from './DocRow.jsx'
import { enOnly } from '../../../i18n/bilingual.js'

export default function DocumentsSection({ app, token, logout }) {
  const docs = [
    { label: enOnly('admin.detail.docs.studentPhoto'), docKey: 'studentPhoto', hasFile: Boolean(app.studentPhotoUrl) },
    { label: enOnly('admin.detail.docs.identityDocument'), docKey: 'identityDocument', hasFile: Boolean(app.identityDocumentUrl) },
    { label: enOnly('admin.detail.docs.educationalCertificates'), docKey: 'educationalCertificates', hasFile: Boolean(app.educationalCertificatesUrl) },
    { label: enOnly('admin.detail.docs.tenthMarkSheet'), docKey: 'tenth.markSheet', hasFile: Boolean(app.tenth?.markSheet) },
    { label: enOnly('admin.detail.docs.twelfthMarkSheet'), docKey: 'twelfth.markSheet', hasFile: Boolean(app.twelfth?.markSheet) },
    { label: enOnly('admin.detail.docs.collegeMarkSheet'), docKey: 'college.markSheet', hasFile: Boolean(app.college?.markSheet) },
    { label: enOnly('admin.detail.docs.fatherDeathCert'), docKey: 'fatherDeathCert', hasFile: Boolean(app.fatherDeathCertUrl) },
    { label: enOnly('admin.detail.docs.motherDeathCert'), docKey: 'motherDeathCert', hasFile: Boolean(app.motherDeathCertUrl) },
    { label: enOnly('admin.detail.docs.singleParentProof'), docKey: 'supportingDocument', hasFile: Boolean(app.supportingDocumentUrl) },
    { label: enOnly('admin.detail.docs.incomeCertificate'), docKey: 'incomeCertificate', hasFile: Boolean(app.incomeCertificateUrl) },
    { label: enOnly('admin.detail.docs.diplomaMarkSheet'), docKey: 'diplomaMarkSheet', hasFile: Boolean(app.diplomaMarkSheetUrl) },
    { label: enOnly('admin.detail.docs.tamilEvidence'), docKey: 'tamilMediumEvidence', hasFile: Boolean(app.tamilMediumEvidenceUrl) },
    { label: enOnly('admin.detail.docs.govtSchoolEvidence'), docKey: 'govtSchoolEvidence', hasFile: Boolean(app.govtSchoolEvidenceUrl) },
    { label: enOnly('admin.detail.docs.communityCertificate'), docKey: 'communityCertificate', hasFile: Boolean(app.communityCertificateUrl) },
    { label: enOnly('admin.detail.docs.selfSupportEvidence'), docKey: 'selfIncomeDoc', hasFile: Boolean(app.selfIncomeDocUrl) },
    { label: enOnly('admin.detail.docs.scholarshipProof'), docKey: 'scholarshipDoc', hasFile: Boolean(app.scholarshipDocUrl) },
  ]

  return (
    <Section title={enOnly('admin.detail.documents')}>
      {docs.map((doc) => (
        <DocRow key={doc.docKey} {...doc} appId={app.id} token={token} logout={logout} />
      ))}
    </Section>
  )
}
