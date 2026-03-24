import WelcomeCard from '../components/WelcomeCard'
import StatsCard from '../components/StatsCard'

export default function AdminPage() {
  return (
    <section className="px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8 min-w-0">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-w-0">
        <WelcomeCard />
        <div className="w-full min-w-0">
          <StatsCard />
        </div>
      </div>
    </section>
  )
}
