class SearchGoogle {
	constructor() {
		this.google = {
			key: 'AIzaSyAqxqzN_wV61labw93yu2h9MX2-jwzCMvs',
			searchUrl: 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
		}
	}
	
	getResults(newQuery) {
		var self = this;

		let params = {
		  "query": newQuery.query + " in " + newQuery.loc,
		  "key": self.google.key
		};

		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", self.google.searchUrl + self.serialize(params), true);
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					let json = JSON.parse(xhr.responseText);
					console.log(json);
					resolve(json.results);
				}
				else {
					reject({
						status: this.status,
						statusText: xhr.statusText
					});
				}
			}

			xhr.onerror = function () {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			};
			console.log(self.google.searchUrl + self.serialize(params));
			xhr.send();
		});
	}
	
	getId(item) {
		let idObj = {
			source: "Google",
			id: item.id,
			name: item.name,
			address: item.formatted_address
		}
		return idObj;
	}
	getLabel(item) {
		return item.name;
	}
	
	serialize(obj) {
	  var str = [];
	  for(var p in obj)
		if (obj.hasOwnProperty(p)) {
		  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	  return str.join("&");
	}
}

export default SearchGoogle;