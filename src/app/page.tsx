import "styles/globals.css";
import Taskboard from './components/Taskboard';


export default function Home() {

  return (
    <>
      <h1 className="text-center my-5 text-3xl font-bold text-gray-600 md:mb-10">
        Taskboard
      </h1>
      <Taskboard />
    </>
  )
}
