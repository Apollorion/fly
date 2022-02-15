# Configuration for github

## org-not-set

To support short urls for multiple people in github, we need to set the organization you'd like to use.  
For example, if you find yourself mostly in the `apollorion` org in github, you can set your org via:
  
`fly set gh-org apollorion`  
  
after setting this, when you fly to a gh link, it will use that org.  
`fly gh manifests.io` will take you to `https://github.com/apollorion/manifests.io`.


## repo-not-set

When using `fly gh` you must provide a repo to fly to within your configured org.
Youre seeing this page because we dont know where to send you. 

Try again with a repo name, something like:  
`fly gh manifests.io` will take you to `https://github.com/<your_configured_org>/manifests.io`.