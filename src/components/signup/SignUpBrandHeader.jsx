import logo from '../../assests/Logo.png'

export default function SignUpBrandHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <img src={logo} alt="" className="w-14 h-14 object-contain mb-3" />
      <h1 className="text-xl font-bold text-brand-navy">Create Your Account</h1>
      <p className="text-sm text-brand-muted mt-1">Sign up to get started.</p>
    </div>
  )
}
