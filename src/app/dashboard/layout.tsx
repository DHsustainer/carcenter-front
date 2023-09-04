import Navbar from "@/components/Navbar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="min-h-full">
        <Navbar></Navbar>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  )
}
