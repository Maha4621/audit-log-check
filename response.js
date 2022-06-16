let teamList = await github.paginate(github.rest.teams.list,
    { org: context.payload.organization.login },
    (resp) => resp.data.map((teamItem) => ({
        "name": teamItem.name,
        "slug": teamItem.slug,
        "id": teamItem.id,
        "parent": teamItem.parent ? {
            "name": teamItem.parent.name,
            "slug": teamItem.parent.slug,
            "id": teamItem.parent.id
        } : null
    }))
)

let teamsCorrect = []
let teamsIncorrect = []
let idpMapping = ''

function getIDPMapping(slug) {
	return new Promise(async function(resolve, reject) {
    let idpResp = {}
    let returnData=[];
    try {
        idpResp = await github.request(`GET /orgs/northerntrust-internal/teams/${slug}/external-groups`)
   } catch (err) {
       resolve(returnData);
    }

   if(idpResp!=null && idpResp.data !=null && idpResp.data.groups !=null){
    if (idpResp.data.groups.length >= 1) {
        returnData =  idpResp.data.groups;
        resolve(returnData)
    }
    else {
      resolve(returnData);
    }
    }else{
      resolve(returnData);
    }
    });
}

let finalJson = [];
teamList.forEach((teamItem) => {
    getIDPMapping(teamItem.slug).then((mapping) => {
        tempItem['idpGroup'] = idpMapping
        finalJson.push(teamItem);
    })
})
console.log("Final JSON")
console.log(finalJson);
