"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const getVersion_1 = require("../../lib/getVersion");
const fs = require("fs");
const path = require("path");
const packageJson = require("../../../package.json");
const root = process.env.VSCODE_CLI_PREPARE_ROOT || path.dirname(path.dirname(path.dirname(__dirname)));
const readJSON = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
let productJsonPath;
const isOSS = process.env.VSCODE_QUALITY === 'oss' || !process.env.VSCODE_QUALITY;
if (isOSS) {
    productJsonPath = path.join(root, 'product.json');
}
else {
    productJsonPath = path.join(root, '.build', 'distro', 'mixin', process.env.VSCODE_QUALITY, 'product.json');
}
console.error('Loading product.json from', productJsonPath);
const product = readJSON(productJsonPath);
const allProductsAndQualities = isOSS ? [product] : fs.readdirSync(path.join(root, '.build', 'distro', 'mixin'))
    .map(quality => ({ quality, json: readJSON(path.join(root, '.build', 'distro', 'mixin', quality, 'product.json')) }));
const commit = (0, getVersion_1.getVersion)(root);
const makeQualityMap = (m) => {
    const output = {};
    for (const { quality, json } of allProductsAndQualities) {
        output[quality] = m(json, quality);
    }
    return output;
};
/**
 * Sets build environment variables for the CLI for current contextual info.
 */
const setLauncherEnvironmentVars = () => {
    const vars = new Map([
        ['VSCODE_CLI_REMOTE_LICENSE_TEXT', product.serverLicense?.join('\\n')],
        ['VSCODE_CLI_REMOTE_LICENSE_PROMPT', product.serverLicensePrompt],
        ['VSCODE_CLI_AI_KEY', product.aiConfig?.cliKey],
        ['VSCODE_CLI_AI_ENDPOINT', product.aiConfig?.cliEndpoint],
        ['VSCODE_CLI_VERSION', packageJson.version],
        ['VSCODE_CLI_UPDATE_ENDPOINT', product.updateUrl],
        ['VSCODE_CLI_QUALITY', product.quality],
        ['VSCODE_CLI_NAME_SHORT', product.nameShort],
        ['VSCODE_CLI_NAME_LONG', product.nameLong],
        ['VSCODE_CLI_QUALITYLESS_PRODUCT_NAME', product.nameLong.replace(/ - [a-z]+$/i, '')],
        ['VSCODE_CLI_DOCUMENTATION_URL', product.documentationUrl],
        ['VSCODE_CLI_APPLICATION_NAME', product.applicationName],
        ['VSCODE_CLI_EDITOR_WEB_URL', product.tunnelApplicationConfig?.editorWebUrl],
        ['VSCODE_CLI_COMMIT', commit],
        [
            'VSCODE_CLI_WIN32_APP_IDS',
            !isOSS && JSON.stringify(makeQualityMap(json => Object.entries(json)
                .filter(([key]) => /^win32.*AppId$/.test(key))
                .map(([, value]) => String(value).replace(/[{}]/g, '')))),
        ],
        [
            'VSCODE_CLI_NAME_LONG_MAP',
            !isOSS && JSON.stringify(makeQualityMap(json => json.nameLong)),
        ],
        [
            'VSCODE_CLI_APPLICATION_NAME_MAP',
            !isOSS && JSON.stringify(makeQualityMap(json => json.applicationName)),
        ],
        [
            'VSCODE_CLI_SERVER_NAME_MAP',
            !isOSS && JSON.stringify(makeQualityMap(json => json.serverApplicationName)),
        ],
        [
            'VSCODE_CLI_QUALITY_DOWNLOAD_URIS',
            !isOSS && JSON.stringify(makeQualityMap(json => json.downloadUrl)),
        ],
    ]);
    if (process.env.VSCODE_CLI_PREPARE_OUTPUT === 'json') {
        console.log(JSON.stringify([...vars].filter(([, v]) => !!v)));
    }
    else {
        for (const [key, value] of vars) {
            if (value) {
                console.log(`##vso[task.setvariable variable=${key}]${value}`);
            }
        }
    }
};
if (require.main === module) {
    setLauncherEnvironmentVars();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByZXBhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Z0dBR2dHOztBQUVoRyxxREFBa0Q7QUFDbEQseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxREFBcUQ7QUFFckQsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEcsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUU3RSxJQUFJLGVBQXVCLENBQUM7QUFDNUIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDbEYsSUFBSSxLQUFLLEVBQUU7SUFDVixlQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7Q0FDbEQ7S0FBTTtJQUNOLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztDQUM1RztBQUVELE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDNUQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sdUJBQXVCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDOUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZILE1BQU0sTUFBTSxHQUFHLElBQUEsdUJBQVUsRUFBQyxJQUFJLENBQUMsQ0FBQztBQUVoQyxNQUFNLGNBQWMsR0FBRyxDQUFJLENBQTJDLEVBQXFCLEVBQUU7SUFDNUYsTUFBTSxNQUFNLEdBQXNCLEVBQUUsQ0FBQztJQUNyQyxLQUFLLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksdUJBQXVCLEVBQUU7UUFDeEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbkM7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSwwQkFBMEIsR0FBRyxHQUFHLEVBQUU7SUFDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUM7UUFDcEIsQ0FBQyxnQ0FBZ0MsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RSxDQUFDLGtDQUFrQyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztRQUNqRSxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO1FBQy9DLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7UUFDekQsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQzNDLENBQUMsNEJBQTRCLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNqRCxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDdkMsQ0FBQyx1QkFBdUIsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzVDLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUMxQyxDQUFDLHFDQUFxQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwRixDQUFDLDhCQUE4QixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUMxRCxDQUFDLDZCQUE2QixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDeEQsQ0FBQywyQkFBMkIsRUFBRSxPQUFPLENBQUMsdUJBQXVCLEVBQUUsWUFBWSxDQUFDO1FBQzVFLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDO1FBQzdCO1lBQ0MsMEJBQTBCO1lBQzFCLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQ3ZCLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2lCQUN6QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzdDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUN6RDtTQUNEO1FBQ0Q7WUFDQywwQkFBMEI7WUFDMUIsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDL0Q7UUFDRDtZQUNDLGlDQUFpQztZQUNqQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN0RTtRQUNEO1lBQ0MsNEJBQTRCO1lBQzVCLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDNUU7UUFDRDtZQUNDLGtDQUFrQztZQUNsQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNsRTtLQUNELENBQUMsQ0FBQztJQUVILElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsS0FBSyxNQUFNLEVBQUU7UUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUQ7U0FBTTtRQUNOLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDaEMsSUFBSSxLQUFLLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDL0Q7U0FDRDtLQUNEO0FBRUYsQ0FBQyxDQUFDO0FBRUYsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtJQUM1QiwwQkFBMEIsRUFBRSxDQUFDO0NBQzdCIn0=