import Section from './Section.jsx'
import Row from './Row.jsx'
import { enOnly } from '../../../i18n/bilingual.js'

export default function DeclarationSection({ app }) {
  return (
    <Section title={enOnly('admin.detail.declaration')}>
      <Row label={enOnly('admin.detail.declarationAccepted')} value={app.declarationAccepted ? enOnly('common.yes') : enOnly('common.no')} />
    </Section>
  )
}
