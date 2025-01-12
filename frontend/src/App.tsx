import NavBar from "@/components/NavBar"
import { useUser } from './hooks/useUser';

function Home() {
  const user = useUser();

  console.log(user?.picture)

  return (
    <div className="full-screen">
      <NavBar />
      <div className="full-screen">
        {
          user &&
          <div className="text-5xl font-bold full-screen">Hello, {user.name}</div>
        }
      </div>
    </div>
  )
}

export default Home;