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

Install on [Chrome Web Store](https://chrome.google.com/webstore/detail/fly/nafhoogklliiodhpleeblaafahecnpcp).

If you want to install the latest unreleased version:
1. download a [release](https://github.com/Apollorion/fly/releases)
2. unzip it
3. navigate to chrome://extensions
4. toggle `Developer mode`
5. `load unpacked` the unzipped contents of the release


# Usage
After installing the extension, in the omnibox via google chrome: `fly {query}`

`fly tfc` taks you to terraform cloud.  
`fly aws` takes you to the aws console.  
`fly aws us-east-1` takes you to the aws console in us-east-1.
etc, etc, etc.

All flights are defined in `extension/flights.ts`.

## Logical Flights
Logical flights are, I guess you could call, "smart links".  
They arent hardcoded into this repository and use logic to determine where you want to go.  
You can set defaults for anything within a logical flight.

Look at the `gh` logical flight as an example. Its logic is as follows: `https://github.com/${gh-org}/${repo}`.

If no defaults are specified, the extension will assume you will pass in at least 2 parameters to the flight.  
`fly hg Apollorion manifests.io` is calculated positionally in this case. `Apollorion` will replace `${gh-org}` and `manifests.io` will replace `${repo}`.  
Which will fly to `https://github.com/Apollorion/manifests.io`.

You can, optionally, set a default for any parameter in a logical flight.  
`fly set gh-org Apollorion` will set the default for `gh-org` to `Apollorion`.  
Now, when you fly the `gh` flight, it will first replace `${gh-org}` with `Apollorion` and then any remaining parameters will be replaced positionally.  
So you could do `fly gh manifests.io` and it will fly to `https://github.com/Apollorion/manifests.io`.

Note: ANY unset parameters will be replaced positionally, in order.  
If you have a logical flight that is defined as `https://my.com/{$thing1}/{$thing2}/{$thing3}`, and you only set the default for `thing1`.
The extension will expect you to pass in 2 parameters at flight time, otherwise a default flight will be used or an error will be thrown.
`fly my.com test1 test2` will fly to `https://my.com/{thing1 default}/test1/test2/`.  
`fly my.com test` will either go to a defined default flight or throw an error.

# Custom flight repos
You can host a custom flight repo and point the extension to it. This will allow you to define standard and logical flights without contributing to this project.

An example repo doc is here: `https://apollorion.com/flight_repo.json`

The custom flight repo has 2 requirements.
1. The `Access-Control-Allow-Origin: *` header is present (this is a chrome requirement)
2. It has the below structure:
```typescript
interface CustomFlightRepo {
    version: string, // Currently supported version is `1`
    logical: {
        [key: string]: {
            logic: string,
            override?: string
        }
    },
    standard: {
        [key: string]: string[]
    }
}
```

To use the custom flight repo, just run `fly set repo $url`. You can unset this repo at anytime via `fly unset repo`.

# Devving this repo

Startup the dev server via `./dev.sh`.
You need to `load unpacked` the extension in the `extension/dist` dir after building at least once.

I havent found a work around yet, but whenever you make a change you need to refresh the extension in `chrome://extensions`.


## Logical Flights
Say a users query is `fly gh Apollorion manifests.io`

The example logic above will match `gh`, split `Apollorion manifests.io` into `$1` = `Apollorion` and `$2` = `manifests.io`.  
The logic defined in `extension/flights.ts` for `gh` is `https://github.com/$1/$2` which resolves to `https://github.com/Apollorion/manifests.io`.

If your logical flight doesnt need to be very smart you can simply add the flight name (`gh` in the above example) to the`logicalFlights` const in `extension/main.ts`.  
The extension will "just work" if you expect users to always type the full query in the extension.  
As an example, the `aws` flight automatically builds the correct query without any special logic because it expects the user to type the full query every time.

If you logical flight does need some custom logic, you can build that into `extension/main.ts`. I'd suggest using `gh` as an example.


# Alfred
If youre looking for the alfred implementation of fly, checkout https://github.com/Apollorion/fly-alfred
