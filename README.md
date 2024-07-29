# UNB COLLECTION

A E-commerce built with Next 14.2 and backed by supabase

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

- Enable and configure Google oAuth on the [providers dashboard](https://supabase.com/dashboard/project/_/auth/providers)
- You may follow the [documentation](https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client&queryGroups=framework&framework=nextjs#prerequisites) to set up it.
- Note that this project is using google automatic sign-in, so you should configure the application for that by setting up correctly the `Authorized JavaScript origins` and `Authorized redirect URIs` on the Google credentials page and the `Authorized Client IDs` on the Supabase google provider config page

2. Clone this repository and go to it's directory

3. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=[INSERT GOOGLE oAuth CLIENT ID]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

   `NEXT_PUBLIC_GOOGLE_CLIENT_ID` Is the same as configured on the step 1.

4. Integrate with **MERCADO PAGO PAYMENT GATEWAY**

   You may follow the [official documentation](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/requirements)

   After all steps, you should update the `.env.local` variables related to MERCADO PAGO, use the Test Credentials for test environment

   ```
   NEXT_PUBLIC_MERCADO_PAGO_API_KEY=[INSERT MERCADO PAGO API KEY FOR TEST ENVIRONMENT]
   MERCADO_PAGO_ACCESS_TOKEN=[INSERT MERCADO PAGO API ACCESS TOKEN FOR TEST ENVIRONMENT]
   ```

5. You can now run the Next.js local development server:

   ```bash
   yarn install && yarn dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
