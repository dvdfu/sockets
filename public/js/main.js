var user;
if (kik.enabled) {
	kik.getUser(function (response) {
		if (response) {
			user = {
				username: response.username,
				thumbnail: response.thumbnail,
				kikUser: true,
			};
			console.log(user);
			document.querySelector('.log-head .log-name').innerHTML = user.username;
			document.querySelector('.log-head .log-icon').innerHTML = '<img src="' + user.thumbnail + '"></img>';
		}
	});
}