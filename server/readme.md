# Is This Thing On?

Welcome to the Is This Thing On server. 

## How to run 

To run locally, you need to:
- Get a serviceAccount file from Firebase, and put it at `/src/serviceAccount.json`. 
- Set up MUX to send web hooks to your local server, using yor favorite tunneling (we recommend [ngrok](https://ngrok.com/))

Then, you can run the server with `npm run dev`. 

## How to deploy

We use [fly](https://fly.io/) to deploy the server. 
- Install flyclt, using `brew install flyctl`
- Login via `fly auth login`
- Deploy via `fly deploy` or `npm run deploy`


## Access needed? 
Ask @soft_networks for access to firebase, mux and fly.