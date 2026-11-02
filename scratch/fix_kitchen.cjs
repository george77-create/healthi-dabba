const fs = require('fs');
let content = fs.readFileSync('src/components/KitchenPortal.jsx', 'utf8');

const marker = '          {/* Individual Customer Dish Allotment & Dabba Packing Manifest */}';
const parts = content.split(marker);

console.log('Total parts:', parts.length);

const manifestEndPattern = '            </div>\n          </div>';
const manifestBody = parts[1].substring(0, parts[1].indexOf(manifestEndPattern) + manifestEndPattern.length);

let cleanContent = parts[0];
for (let i = 1; i < parts.length; i++) {
  let rest = parts[i];
  if (rest.startsWith(manifestBody)) {
    rest = rest.slice(manifestBody.length);
  }
  cleanContent += rest;
}

// Find position after Allergy & Dietary Customization Board
const allergyIdx = cleanContent.indexOf('Allergy & Dietary Customization Board');
if (allergyIdx !== -1) {
  // Find the next </div>\n          </div> after allergyIdx
  const closeIdx = cleanContent.indexOf('            </div>\n          </div>', allergyIdx);
  if (closeIdx !== -1) {
    const insertPoint = closeIdx + '            </div>\n          </div>'.length;
    const finalContent = cleanContent.slice(0, insertPoint) + '\n\n' + marker + manifestBody + cleanContent.slice(insertPoint);
    fs.writeFileSync('src/components/KitchenPortal.jsx', finalContent, 'utf8');
    console.log('SUCCESS! Manifest inserted exactly once.');
  } else {
    console.log('closeIdx not found');
  }
} else {
  console.log('allergyIdx not found');
}
