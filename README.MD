<p align="center">
   <img src="https://github.com/Apollorion/fly/blob/master/icon.png?raw=true">
</p>
<p align="center">FLY - Shortlinks for engineers.</p>
<p align="center">http://fly.apollorion.com/</p>

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
`fly aws-us-east-1` takes you to the aws console in us-east-1.
etc, etc, etc.

Additionally, it will search your bookmarks for links. This is however, not the intended use case.  
All fly.apollorion.com links are in `links.tf` and are supported by this extension.  



# Alfred
If youre looking for the alfred implementation of fly, checkout https://github.com/Apollorion/fly-alfred