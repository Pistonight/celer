This tutorial will guide you through how to use the GitHub web interface to clone someone else's published route. You don't need programming knowledge to do this, but you do need to know the syntax for celer to make changes. Please check out the other [tutorials](./order.txt)

## Getting the Source Code
First you will need a link to the source code of the route you are copying/forking. You can get this from the route URL.

The route URL is in the format of
```
https://celer.itntpiston.app/#/gh/<name>/<repo>
```
The source code of that route will usually be at 
```
https://github.com/<name>/<repo>
```
Example: if the url is https://celer.itntpiston.app/#/gh/iTNTPiston/as3, then the route source is at https://github.com/iTNTPiston/as3.
If this doesn't work, you need to contact the author(s) of the route to provide you with their source.

## Creating a link to a particular version of the route
Sometimes route maintainers make updates to the route frequently and the route doc may become unstable for people to learn. You can create a link to a "freezed" version of the route by referencing a particular commit. This guide will show how to create a link to the latest version (i.e. commit)

1. Go to the repo (example: https://github.com/iTNTPiston/as3)
2. Click on "X commits" shown in the red box below. This will take you to the commit history
<img width="697" alt="image" src="https://user-images.githubusercontent.com/44533763/183716733-0cf84d96-6c6d-4849-93e6-6ac6c761e58d.png">

3. Click on "Copy full SHA" on the latest (first) commit. You can also click the ones below for previous versions
<img width="935" alt="image" src="https://user-images.githubusercontent.com/44533763/183717448-ba6c49ec-d8da-4d2c-8855-d36ffe4edbec.png">

4. This will copy something like this `2c592f159f63fe5717f8ed835b448ea1948ae918`, which is called the **hash** of the commit
5. Now all you need to do is add the hash to the end of the route URL like this:

```
https://celer.itntpiston.app/#/gh/<name>/<repo>/<hash>
```
Example: https://celer.itntpiston.app/#/gh/iTNTPiston/as3/fae07406e8dac0923c90b162c5a730930c549484

**Note: sometimes a route URL already has a branch specified like `#/gh/<name>/<repo>/<branch>`. In that case, you need to replace `<branch>` with the hash you copied**



## Creating a Copy/Fork
*This section explains how to clone/fork a repo. If you are already familar with Git/GitHub, you can skip this section*

You can either download directly from the source code link (a.k.a repository), or creating a fork on GitHub and download that. If you create a fork, you can later save your changes to GitHub and also let others view your changes.

To **fork then download** (You need an GitHub account for this)
1. Click on this 
![image](https://user-images.githubusercontent.com/44533763/180585136-b95a3208-ac89-49b3-85d4-8779b5b05e32.png)
2. Select where you want to fork (usually <YOUR_NAME>/<ROUTE_NAME>) and Click on `Create a Fork`
3. It should take you to the forked repo after. Follow the steps below to download it.

To **just download without forking**:
1. Click on this 
![image](https://user-images.githubusercontent.com/44533763/180585066-75a6867b-6441-4224-83d4-fba137a1cd1c.png)
2. Click this 
![image](https://user-images.githubusercontent.com/44533763/180585081-da9c7dad-c329-482f-9966-fbcb6589b247.png)
3. Extract the `.zip` you downloaded into a folder. The folder should have a file called `main.celer` in it.

## Viewing the route
You need to install the celer devtool to view route files on your computer. Follow this [guide](https://github.com/iTNTPiston/celer/wiki/Installation) to install

After the devtool is installed, run `celer dev` in a shell in the folder where the source code is (this starts the dev server on your computer). The dev server will tell you to go to https://celer.itntpiston.app/#/dev. Open that in a web browser and you should see the route.

## Changing the route
You can make changes to the `.celer` files you downloaded. After you save the change, the dev server will detect and send the changes to the web app (You need to make sure the dev server is running).

Follow the [tutorials for writing route docs](./Routing/order.txt) to see how celer syntax works
