# Is This Thing On?

Welcome to the Is This Thing On server. 

## How to run 
To run locally, you need to:
- Get access to firebase and mux from @soft_networks
- Set up environment with firebase admin and mux keys
- Run the server with `npm run dev`. 

Then, you can run the server with `npm run dev`. 

## How to tunnel
Optionally, you can also have your local server receive webhooks from mux. For this, we recommend a tunneling service with stable domains like [localhost.run](https://localhost.run).  Then, within the mux dashboard, set up a webook that points to `https://MUX_USERNAME:MUX_PASSWORD@TUNNEL_URL/mux-hook`. You can learn more [here](https://docs.mux.com/core/listen-for-webhooks). 


## How to deploy

We use [fly](https://fly.io/) to deploy the server. 
- Install flyclt, using `brew install flyctl`
- Login via `fly auth login`
- Deploy via `fly deploy` or `npm run deploy`
