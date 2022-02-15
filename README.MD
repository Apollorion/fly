<p align="center">
   <img src="https://github.com/Apollorion/fly/blob/main/extension/img.png?raw=true">
</p>
<p align="center">FLY - Software engineer quicklinks.</p>
<p align="center">http://fly.apollorion.com/</p>

[![main](https://github.com/Apollorion/fly/actions/workflows/main.yml/badge.svg)](https://github.com/Apollorion/fly/actions/workflows/main.yml)

# What is FLY?
Im an engineer and it annoys me that I have to go through a sales portal to get where I need.  

For instance, `datadog.com` takes me to `datadoghq.com`'s main landing page instead of directly to `app.datadoghq.com`.
The same is for `terraform.io` (I want `app.terraform.io/app`) and aws (gimme more console) and so much more!

Many products / sites are this way. I just want to go straight to what I care about and not have to jump through a bunch of links.

Now, with fly, I can just use the fly extension to do `fly tfc` and it will take me to `app.terraform.io/app`!

# Installation

Coming soon! Submitted to chrome app store!  
If you want to install now, clone this repo and `load unpacked` the extension directory in chrome.


# Usage
After installing the extension, in the omnibox via google chrome: `fly {query}`

Fly will follow any links to `fly.apollorion.com/$query`.

`fly tfc` taks you to terraform cloud.  
`fly aws` takes you to the aws console.  
`fly aws us-east-1` takes you to the aws console in us-east-1.
etc, etc, etc.

All flights are defined in `flights.tf`.

## Logical Flights
Logical flights are, I guess you could call, "smart links".
They arent hardcoded into this repository and use logic to determine where you want to go.  
Some logical flights (`gh` for example) may require some initial configuration (see below).

### Github - `gh`
The `gh` logical flight works 2 ways.
#### Default Org (config required)
If you visit a specific github org often, you can set the org name so that during the flight you only have to specify the repo name.

Say you visit the `Apollorion` github org a lot.  
You can run `fly set gh-org Apollorion` and now the extension will assume the `Apollorion` org if an org isnt directly specified.
Flights like `fly gh manifests.io` will now take you to `https://github.com/Apollorion/manifests.io`.
#### Specifying Org
If you specify an org during your flight, it will use that org instead of the default one.

Flights like `fly gh Apollorion manifests.io` will take you to `https://github.com/Apollorion/manifests.io`.

### AWS - `aws`
The `aws` logical flight will take you to the default console home (`https://console.aws.amazon.com/console/home`) if your flight is just `fly aws`.  
Alternatively, you can go to a specific region via `fly aws us-east-1`.

# Devving this repo

## Logical Flights
Logical flights are always going to return a 404 from the CDN (rewritten to 200 for the end user).  
A logical flights will look like `https://fly.apollorion.com/flight/gh/Apollorion%23-%23manifests.io`

The example logic above will match `gh`, split `Apollorion%23-%23manifests.io` into `$1` = `Apollorion` and `$2` = `manifests.io`.  
The logic defined in `flights.tf` for `gh` is `https://github.com/$1/$2` which resolves to `https://github.com/Apollorion/manifests.io`.

If your logical flight doesnt need to be very smart you can simply add the flight name (`gh` in the above example) to the`supportedLogicalFlights` const in `extension/background.js`.  
The extension will "just work" if you expect users to always type the full query in the extension.  
As an example, the `aws` flight automatically builds the correct query without any special logic because it expects the user to type the full query every time.

If you logical flight does need some custom logic, you can build that into `extension/background.js`. I'd suggest using `gh` as an example.


# Alfred
If youre looking for the alfred implementation of fly, checkout https://github.com/Apollorion/fly-alfred
