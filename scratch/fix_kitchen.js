const fs = require('fs');
let content = fs.readFileSync('src/components/KitchenPortal.jsx', 'utf8');

const marker = '          {/* Individual Customer Dish Allotment & Dabba Packing Manifest */}';
const parts = content.split(marker);

// parts[0] has everything before first occurrence.
// inside parts 1..N, each has the manifest block followed by whatever followed '</div>\n          </div>'.
// Let's find the manifest block ending:
// The manifest block ends with:
// '            </div>\n          </div>'
console.log('Total parts:', parts.length);

// Let's isolate the manifest block:
const manifestEndPattern = '            </div>\n          </div>';
const manifestBody = parts[1].substring(0, parts[1].indexOf(manifestEndPattern) + manifestEndPattern.length);

// For each part after part 0, strip out the manifestBody
let cleanContent = parts[0];
for (let i = 1; i < parts.length; i++) {
  let rest = parts[i];
  if (rest.startsWith(manifestBody)) {
    rest = rest.slice(manifestBody.length);
  }
  cleanContent += rest;
}

// Now cleanContent is back to original without any manifest!
// Let's insert the manifest exactly once after the Allergy & Dietary Customization Board
const allergyTarget = '                    Kitchen Sticker Tagged on Box\n                  </span>\n                </div>\n              ))}\n            </div>\n          </div>';

if (cleanContent.includes(allergyTarget)) {
  const finalContent = cleanContent.replace(
    allergyTarget,
    allergyTarget + '\n\n' + marker + manifestBody
  );
  fs.writeFileSync('src/components/KitchenPortal.jsx', finalContent, 'utf8');
  console.log('SUCCESS! Manifest inserted exactly once.');
} else {
  console.log('allergyTarget not found! Check line endings.');
}
