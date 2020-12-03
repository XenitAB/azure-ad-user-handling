import * as User from "./User";

export const layout = (str: string) => `<html>
    <head>
        <title>User handling</title>
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body>
    <div class="w-full h-screen">
    <header class="bg-gray-600">
      <nav class="flex justify-between w-full bg-gray-600 text-white p-4">
        <div class="flex">
            <a class="block md:text-white mr-4" href="/">Home</a>
        </div>
      </nav>
    </header>
        <div class="container mx-auto">
        <div class="border w-full lg:w-2/4 mx-auto border-gray-400 rounded-lg md:p-4 sm:py-3 py-4 px-2 m-10 bg-gray-800">
            ${str}
            </div>
        </div>
    </body>
</html>`;

export const user = (data: unknown) =>
  `<pre><code>${JSON.stringify(data, null, 2)}</code></pre>`;

export const user_input = (
  action: string,
  button_label: string,
  value?: string
) => `
<div class="flex justify-center mt-6">
<form
  action="${action}"
  method="POST"
  enctype="application/x-www-form-urlencoded"
>
<input
    name="user_id"
    ${value ? 'hidden value="' + value + '"' : ""}
    placeholder="Enter User id (Object id)"
    class="placeholder-gray-600 m-1 p-2 appearance-none text-gray-700 text-sm rounded-lg focus:outline-none"
/>
<button
    type="submit"
    class="w-48 m-1 p-2 text-sm bg-white rounded-lg font-semibold uppercase">${button_label}</button>
</form>
</div>`;

const user_form = (user: User.t) => `<h2 class="text-xl text-gray-200">${
  user.displayName
} (${user.mail})</h2>
<h4 class="text-md text-gray-200">${user.userPrincipalName}</h4>
${user_input(
  user.accountEnabled ? "/disable_user" : "/enable_user",
  user.accountEnabled ? "Disable user" : "Enable user",
  user.id
)}`;

export const users_form = (search: string, users: User.t[]) => {
  try {
    if (users.length !== 0) {
      return `<h2 class="text-2xl text-white">Searched for "${search}"</h2>
<hr /><br />
${users.map(user_form).join("<br /><hr /><br />")}`;
    } else {
      return `<p class="text-white">No users found for search term "${search}"</p>`;
    }
  } catch (e) {
    return JSON.stringify(e);
  }
};
