# UNB COLLECTION

A E-commerce built with Next 14.2 and backed by supabase

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

- Enable and configure Google oAuth on the [providers dashboard](https://supabase.com/dashboard/project/_/auth/providers)
- You may follow the [documentation](https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client&queryGroups=framework&framework=nextjs#prerequisites) to set up it.

2. Clone this repository and go to it's directory

3. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

4. You can now run the Next.js local development server:

   ```bash
   yarn install && yarn dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
