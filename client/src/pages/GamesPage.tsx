import ErrorTemplate from "../template/ErrorTemplate"
import { LoadingTemplate } from "../template/LoadingTemplate"
import { SizeTable } from "../template/SizeTable"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "../lib/trpc"
import { useSearchParams } from "react-router"
import { WineIcon } from "@phosphor-icons/react"

const GamesPage = () => {
  const [searchParams] = useSearchParams()
  const sizeUrl = searchParams.get("size")

  const initSize = 6
  const finalSize = sizeUrl ? Number(sizeUrl) : initSize

  const trpc = useTRPC()
  const dataQuery = useQuery(trpc.game.getGames.queryOptions({ size: finalSize }))
  if (dataQuery.isLoading) return <LoadingTemplate />
  console.log(dataQuery.data?.data)
  if (!dataQuery.data?.data) return <ErrorTemplate message="No data found" />
  return (
    <div className="p-6">
      <div className="flex items-center">
        <WineIcon className="text-3xl mr-3" />
        <h1>Games</h1>
      </div>
      <p>This page is public. Both logged-in and non-logged-in users can access it.</p>
      <p>
        This data comes from an external API:{" "}
        <a className="link" href="https://docs.zelda.fanapis.com/docs/games" target="_blank" rel="noopener noreferrer">
          Zelda Fan API
        </a>
        .
      </p>
      <div className="flex items-center mt-4 mb-4">
        <SizeTable initSize={initSize} />
        <span className="ml-1">Games per page</span>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Developer</th>
              <th>Publisher</th>
              <th>Released Date</th>
            </tr>
          </thead>

          <tbody>
            {dataQuery.data.data.map((singleElement) => (
              <tr key={singleElement.id}>
                <td>{singleElement.name}</td>
                <td>{singleElement.description}</td>
                <td>{singleElement.developer}</td>
                <td>{singleElement.publisher}</td>
                <td>{singleElement.released_date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {dataQuery.isError && <ErrorTemplate message={dataQuery.error.message} />}
      </div>
    </div>
  )
}

export default GamesPage
