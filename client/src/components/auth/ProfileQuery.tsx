import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "../../lib/trpc"
import { LoadingTemplate } from "../../template/LoadingTemplate"
import ErrorTemplate from "../../template/ErrorTemplate"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { User, UserCircle, Mail } from "lucide-react"

type Props = {
  meId: string
}

const ProfileQuery = (props: Props) => {
  const trpc = useTRPC()
  const dataQuery = useQuery(trpc.user.getUserProfile.queryOptions({ id: props.meId }))

  if (dataQuery.isLoading) return <LoadingTemplate />
  if (dataQuery.isError) return <ErrorTemplate message={dataQuery.error.message} />
  if (!dataQuery.data) return <div>No data</div>

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black">
              {dataQuery.data.name?.charAt(0).toUpperCase() || <UserCircle className="w-12 h-12" />}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {dataQuery.data.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <p className="text-sm">{dataQuery.data.email}</p>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="grid gap-4 pt-4 border-t">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">ID do Usuário</span>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{dataQuery.data.id}</span>
            </div>

            {dataQuery.data.createdAt && (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Membro desde</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(dataQuery.data.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default ProfileQuery
