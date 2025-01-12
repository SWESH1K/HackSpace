import NavBar from "@/components/NavBar"
import { useUser } from './hooks/useUser';

function Home() {
  const user = useUser();

  return (
    <div>
      <NavBar />
      <div className="p-4">
        {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      </div>
    </div>
  )
}

export default Home;