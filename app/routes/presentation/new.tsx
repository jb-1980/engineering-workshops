import { User } from "@prisma/client"
import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
  useNavigate,
} from "remix"
import PresentationForm from "~/components/presentation-form"
import { getUser, getUsers, requireUserId } from "~/utils/users.server"
import stylesUrl from "~/styles/presentation-id.css"
import formStylesUrl from "~/styles/presentation-form.css"

import { createPresentation } from "~/utils/presentations.server"

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: formStylesUrl },
  ]
}

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request)
  const form = await request.formData()
  const title = form.get("title")
  const suggester = form.get("suggester")
  const presenter = form.get("presenter")
  const notes = form.get("notes")
  if (
    typeof title !== "string" ||
    typeof suggester !== "string" ||
    typeof presenter !== "string" ||
    typeof notes !== "string"
  ) {
    return { formError: `Form not submitted correctly.` }
  }
  const presentation = await createPresentation(
    title,
    suggester,
    presenter,
    notes
  )

  return redirect(`/presentation/${presentation.id}`)
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request, true)
  const users = await getUsers()
  return { user, users }
}

const NewPresentation = () => {
  const { user, users } = useLoaderData<{ user: User; users: User[] }>()
  const navigate = useNavigate()
  const dismiss = () => navigate("/presentation")
  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Workshop Presentation</h1>
      <PresentationForm user={user} users={users} onDismiss={dismiss} />
    </div>
  )
}

export default NewPresentation
