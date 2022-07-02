#!/bin/sh
while true; do
title="JustGonDev-Sync-Node"
echo -e '\033]2;'$title'\007'
clear && echo "Author: JustGonDev" && echo "Copyright © 2022 JustGonDev. All rights reserved." && echo ""
       read -p "This source code will upgrade your nodejs to version 17. Make sure you want to do this. We will not be responsible for any unexpected problems. Are you sure ? (Y/N) " yn 

       case $yn in 

               [Yy]* ) clear && echo "Author: JustGonDev" && echo "Copyright © 2022 JustGonDev. All rights reserved." && echo "" && npm init -y && npm i --save-dev node@17 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH && clear && echo "Author: JustGonDev" && echo "Copyright © 2022 JustGonDev. All rights reserved." && echo "" && read -p "Do you want to start bot? (Y/N) " yn 

       case $yn in 

               [Yy]* ) clear && echo "Author: JustGonDev" && echo "Copyright © 2022 JustGonDev. All rights reserved." && echo "" && npm start; break;;

               [Nn]* ) clear && echo "Author: JustGonDev" && echo "Copyright © 2022 JustGonDev. All rights reserved." && echo "" && echo "See you!"; exit;; 

               * ) echo "Please answer yes or no.";; 

      esac;;

               [Nn]* ) clear && echo "Author: JustGonDev" && echo "Copyright © 2022 JustGonDev. All rights reserved." && echo "" && echo "See you!"; exit;; 

               * ) echo "Please answer yes or no.";; 

      esac

done