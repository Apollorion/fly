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
Install on [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/fly-engineers/).

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
Logical flights are smarter than a standard flight because you can set defaults for any variable of the flight.

Defaults can be set/unset via:
- `fly set {key} {value}`
- `fly unset {key}`

### How it works
Look at the `gh` logical flight as an example. Its logic is as follows: `https://github.com/${gh-org:plain}/${repo:plain}`.

If no defaults are specified, the extension will assume you will pass in 2 parameters to the flight.  
`fly gh Apollorion manifests.io` is calculated positionally. `Apollorion` (the first parameter) will replace `${gh-org:plain}` (the first variable)
and `manifests.io` (the second parameter) will replace `${repo:plain}` (the second variable).
Which will fly to `https://github.com/Apollorion/manifests.io`.

You can, optionally, set a default for any variable in a logical flight.  
`fly set gh-org Apollorion` will set the default for `gh-org` to `Apollorion`.
Now, when you fly the `gh` flight, it will first replace `${gh-org:plain}` with `Apollorion` and then any remaining parameters will be replaced positionally, like above.
So you could do `fly gh manifests.io` and it will fly to `https://github.com/Apollorion/manifests.io`.

Note: ANY unset parameters will be replaced positionally, in order.  
If you have a logical flight that is defined as `https://my.com/${thing1:plain}/${thing2:plain}/${thing3:plain}`, and you only set the default for `thing1`.
The extension will expect you to pass in 2 parameters at flight time, otherwise a default flight will be used or an error will be thrown.  
`fly my.com test1 test2` will fly to `https://my.com/{thing1 default}/test1/test2/`.  
`fly my.com test` will either go to a defined default flight or throw an error.

### Types
Types are useful when you want the application to do something to a string before its passed to the browser.  
`plain` will pass the value as plain text (I.E. it will do nothing)  
`urlencode` will url encode the value

An example of this would be the built in `ghcs` flight. When searching github code search, the values need to be url encoded. 
So when you query ghcs the user can pass in plain text, but it will be url encoded for the browser.

Currently, only `plain` and `urlencode` are supported. All variables must have a type defined.

# Custom flight repos
You can host a custom flight repo and point the extension to it. This will allow you to define standard and logical flights without contributing to this project.

Repos can be managed via:
- `fly repo set {name} {url}`
- `fly repo unset {name}`
- `fly repo update` - this is what actually fetch's flight data. Akin to `apt update`.

The custom flight repo has 2 requirements.
1. The `Access-Control-Allow-Origin: *` header is present (this is a chrome requirement)
2. It has the below structure:
```typescript
interface CustomFlightRepo {
    version: string, // Currently supported version is `2`
    logical: {
        [key: string]: {
            logic: string[],
            override?: string
        }
    },
    standard: {
        [key: string]: string[]
    }
}
```
An example repo doc is here: `https://raw.githubusercontent.com/Apollorion/fly/main/help/example-repo.json`

ex:
1. `fly repo set apollorion https://raw.githubusercontent.com/Apollorion/fly/main/help/example-repo.json`
2. `fly repo update`
3. `fly repo unset apollorion`

## Custom flight logic evaluation
Custom flights are a list of strings that are evaluated first come, first served, the extension will evaluate the first logic and if its not suitable it will move to the next.
A suitable flight is defined as; when the number of parameters passed in by the user is 0 and there are no variables left in the logic.

The only exception to this rule is if the last variable in the last defined flight logic has the type `urlencode`, its the only parameter, and no other matches were found.
In this case, the application will url encode all the parameters together and take that flight. You can see this in action with the built in `ghcs` flight. 
As long as you pass at least 3 or more parameters to that flight, it will urlencode them together.

Note: Logical flights take precedence over standard flights, in a custom flight repo. If a flight is defined in this extension as a logical flight, and you want to simplify it, you will want to
define it as a logical flight in your repo. Otherwise, your flight will not work.

# Devving this repo

Startup the dev server via `./dev.sh`.
You need to `load unpacked` the extension in the `extension/dist` dir after building at least once.

I haven't found a work around yet, but whenever you make a change you need to refresh the extension in `chrome://extensions`.

# Alfred
If you're looking for the alfred implementation of fly, checkout https://github.com/Apollorion/fly-alfred (depreciated).
