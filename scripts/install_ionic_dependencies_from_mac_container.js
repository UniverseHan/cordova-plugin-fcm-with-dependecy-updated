#!/usr/bin/env node
'use strict';

const helpers = require('./helpers');
let DEST_PATH = '';

const shouldInstallIonicDependencies = function () {
    const fs = require('fs');
    const packageFilePath = `${process.cwd()}/package.json`;
    console.log(`package file path is [${packageFilePath}]`);
    if (!helpers.fileExists(packageFilePath)) {
        helpers.logWarning('package.json was not found.');
        helpers.logWarning('Ionic dependencies omission cannot be safely skipped.');
        return true;
    }
    let packageDataString;
    try {
        packageDataString = fs.readFileSync(packageFilePath);
    } catch (e) {
        helpers.logWarning('package.json found is unreadable.', e);
        helpers.logWarning('Ionic dependencies omission cannot be safely skipped.');
        return true;
    }
    let packageData;
    try {
        packageData = JSON.parse(packageDataString);
    } catch (e) {
        helpers.logWarning('package.json could not be parsed.', e);
        helpers.logWarning('Ionic dependencies omission cannot be safely skipped.');
        return true;
    }
    return !!(
        packageData &&
        packageData.dependencies &&
        packageData.dependencies['@ionic-native/core']
    );
};

const installIonicDependencies = async function () {
    const path = require('path');
    let fullDestPath = `${path.dirname(process.cwd())}/${DEST_PATH}`;
    const fullBasePath = process.cwd();
    console.log(`fullDestPath is ${fullDestPath}`);
    fullDestPath = `${process.cwd()}/node_modules/cordova-plugin-fcm-with-dependecy-updated/${DEST_PATH}`;
    console.log(`changed path is ${fullDestPath}`)
    try {
        process.chdir(fullDestPath);
    } catch (error) {
        helpers.logError(`Failed change directory to ${fullDestPath}!`, error);
        helpers.logError(
            `Please run \`cd node_modules/cordova-plugin-fcm-with-dependecy-updated/${DEST_PATH}; npm install\` manually`
        );
        return;
    }

    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    try {
        const output = helpers.executeSync(npm, ['install', '--loglevel', 'error', '--no-progress'])
        console.log(`Ionic dependencies installed for ${DEST_PATH}:`);
        console.log(output);
        process.chdir(fullBasePath);
        
    }catch (error) {
        console.error(error);
    }
};

const destinations = ['ionic', 'ionic/ngx', 'ionic/v4']

const installDependencies = async (targets) =>  {
    if (!shouldInstallIonicDependencies()) {
        console.log(`Ionic dependencies install skipped for ${DEST_PATH}`);
        return;
    }

    for (let i in targets) {
        DEST_PATH = targets[i];
        console.log(`before install ${DEST_PATH}`);
        await installIonicDependencies();
        console.log(`after install ${DEST_PATH}`);
    }
}

installDependencies(destinations);