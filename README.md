# interactiveSelinuxDocs
Navigate the selinux refpolicy in your browser, even locally. Example: https://www.0x17.de/selinux/#a=&t=cron_role&c=

## Assumptions
- Interface definitions have ') for their ending on a separate line.
- Quotes (` and ') are counted to separate the inside and outside of definitions.

## How to generate the docs
Either download or clone the refpolicy from https://gitweb.gentoo.org/proj/hardened-refpolicy.git

Copy ```gen.js``` into the resulting folder and run ```node gen.js```.

The resulting ```definitions.js``` needs to be inside the same folder as your ```index.html```.
