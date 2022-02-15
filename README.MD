<p align="center">
   <img src="https://github.com/Apollorion/fly/blob/main/extension/img.png?raw=true">
</p>
<p align="center">FLY - Shortlinks for engineers.</p>
<p align="center">http://fly.apollorion.com/</p>

[![main](https://github.com/Apollorion/fly/actions/workflows/main.yml/badge.svg)](https://github.com/Apollorion/fly/actions/workflows/main.yml)

# What is FLY?
Im an engineer and it annoys me that I have to go through a sales portal to get where I need.  
For instance, `datadog.com` takes me to `datadoghq.com`'s main landing page instead of directly to `app.datadoghq.com/`.  
The same is for `terraform.io` when I want to actually go to `app.terraform.io/app`.  
Many products / sites are this way. I just want to directly go to what I want.

Now, with fly, I can just use the fly extension to do `fly tfc` and it will take me to `app.terraform.io/app`!

# Installation

Coming soon! Submitted to chrome app store!  
If you want to install now, clone this repo and `load unpacked` the extension directory in chrome.


# Usage
After installing the extension, in the omnibox via google chrome: `fly {search}`

Fly will follow any links to `fly.apollorion.com/$query`.

`fly tfc` taks you to terraform cloud.  
`fly aws` takes you to the aws console.  
`fly aws us-east-1` takes you to the aws console in us-east-1.
etc, etc, etc.

All fly.apollorion.com links are in `flights.tf` and are supported by this extension.

## Logical Flights
Logical flights are kind of "smart links".
Some logical flights (`gh` or github for example) may require some initial configuration.

### gh
The gh logical flight works 2 ways
#### default org
If you visit a github org often, you can set the org name so that during the flight you only have to specify the repo name.
Say you visit the `Apollorion` github org a lot.
You can run `fly set gh-org Apollorion` and then whenever you want to fly to any repo within that org you only need to specify the repo name.
So say you want to go to `https://github.com/Apollorion/manifests.io`, if you've set `Apollorion` as the default org you only need to `fly gh manifests.io`.
#### specifying org
If you specify an org during your flight, it will use that org instead of the default one.
So flights like `fly gh Apollorion manifests.io` will take you to `https://github.com/Apollorion/manifests.io`.

### aws
The aws logical flight will take you to the default `https://console.aws.amazon.com/console/home` if you just `fly aws`.
Or you can go to a specific region via `fly aws us-east-1`.

# Devving this repo

## Logical Flights
Logical flights are always going to return a 404 from the CDN (rewritten to 200 for the end user).  
A logical flights will look like `https://fly.apollorion.com/flight/gh/Apollorion-manifests.io`

The example logic above will match `gh`, split `Apollorion-manifests.io` into `$1` = `Apollorion` and `$2` = `manifests.io`.  
The logic defined in `links.tf` for `gh` is `https://github.com/$1/$2` which resolves to `https://github.com/Apollorion/manifests.io`.

If your logical flight doesnt need to be very smart you can simply add the flight name (`gh` in the above example) to the`supportedLogicalFlights` const in `extension/background.js`.
The extension will "just work" if you expect users to always type the full query in the extension.
As an example, if the `gh` flight wasnt very smart, you could just do `fly gh Apollorion Manifests.io` and the correct url will auto generate.

If you logical flight does need some custom logic, you can build that into `extension/background.js`. I'd suggest using `gh` as an example.


# Alfred
If youre looking for the alfred implementation of fly, checkout https://github.com/Apollorion/fly-alfred
