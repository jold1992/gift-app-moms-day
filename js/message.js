(function () {
	const messageItemClass = 'message-item';
	const messageCreators = [
		messageData => 'Feliz día, querida ' + (messageData.momName || 'mamá') + ',',
		() => 'Hoy celebramos todo lo que eres y todo lo que haces por nosotros. 🎊',
		() => 'Tu amor y dedicación son el pilar de nuestra familia.',
		messageData => 'Admiro mucho tu' + (' ' + messageData.birthdate || 's superpoderes') + ', eres excepcional.',
		messageData => (messageData.faveThing || 'Lo eres todo para mi'),
		() => 'Te amo, Mamá. ❤️',
	];

	let currentMessageIndex = 0;
	let linkTimeout = null;

	function showMessages() {
		const query = parseQuery(window.location.search);
		const messageData = getMessageData(query);

		const mainElem = document.querySelector('.main');
		messageCreators.forEach(messageCreator => {
			const messageElem = createMessageItem(messageCreator(messageData));
			mainElem.appendChild(messageElem);
		});

		document.getElementById('downArrowButton').addEventListener('click', handleMoveToNextMessage);
		document.getElementById('upArrowButton').addEventListener('click', handleMoveToPrevMessage);
		document.addEventListener('keydown', e => {
			if (e.key === 'ArrowUp') {
				handleMoveToNextMessage('up');
			} else if (e.key === 'ArrowDown') {
				handleMoveToNextMessage('down');
			}
		});
	}

	function createMessageItem(message) {
		const itemContainer = document.createElement('div');
		itemContainer.className = messageItemClass;

		const item = document.createElement('span');
		item.className = 'message-item-text';
		item.textContent = message;
		itemContainer.appendChild(item);

		return itemContainer;
	}

	function handleMoveToNextMessage(direction) {
		clearTimeout(linkTimeout);

		const messages = document.getElementsByClassName(messageItemClass);
		if (direction === 'up') {
			currentMessageIndex = Math.max(0, currentMessageIndex - 1);
		} else {
			currentMessageIndex = Math.min(messages.length - 1, currentMessageIndex + 1);
		}

		const downArrow = document.getElementById('downArrowButton');
		const indexLink = document.getElementById('indexLink');
		if (currentMessageIndex === messages.length - 1) {
			downArrow.style.display = 'none';
			indexLink.style.display = 'inline-block';
			linkTimeout = setTimeout(() => {
				indexLink.style.opacity = 1;
			}, 2000);
		} else {
			downArrow.style.display = 'inline-block';
			indexLink.style.display = 'none';
			indexLink.style.opacity = 0;
		}	

		const upArrow = document.getElementById('upButton');
		if (currentMessageIndex === 0) {
			console.log('entraaaa')
			upArrow.style.display = 'none';			
		} else {
			upArrow.style.display = 'flex';
		}



		const currentMessage = messages[currentMessageIndex];
		TweenLite.to(
			document.querySelector('.main'),
			1.5,
			{
				scrollTo: currentMessage.offsetTop,
				ease: Power3.easeInOut,
			}
		);
	}

	function handleMoveToPrevMessage(direction) {
		clearTimeout(linkTimeout);

		const messages = document.getElementsByClassName(messageItemClass);
		if (direction === 'down') {
			currentMessageIndex = Math.min(messages.length - 1, currentMessageIndex + 1);			
		} else {
			currentMessageIndex = Math.max(0, currentMessageIndex - 1);
		}

		const upArrow = document.getElementById('upButton');
		const indexLink = document.getElementById('indexLink');
		if (currentMessageIndex === 0) {
			console.log('entraaaa')
			upArrow.style.display = 'none';
			indexLink.style.display = 'inline-block';
			linkTimeout = setTimeout(() => {
				indexLink.style.opacity = 1;
			}, 2000);
		} else {
			upArrow.style.display = 'flex';
			indexLink.style.display = 'none';
			indexLink.style.opacity = 0;
		}	

		const downArrow = document.getElementById('downArrowButton');		
		if (currentMessageIndex === messages.length - 1) {
			downArrow.style.display = 'none';			
		} else {
			downArrow.style.display = 'inline-block';
		}

		const currentMessage = messages[currentMessageIndex];
		TweenLite.to(
			document.querySelector('.main'),
			1.5,
			{
				scrollTo: currentMessage.offsetTop,
				ease: Power3.easeInOut,
			}
		);
	}

	function parseQuery(query) {
		let parsedQuery = {};
		if (query) {
			if (query[0] === '?') {
				query = query.slice(1);
			}

			const paramsAndValues = query.split('&').filter(x => x);
			parsedQuery = paramsAndValues.reduce((acc, paramAndValue) => {
				const indexOfEquals = paramAndValue.indexOf('=');

				let key;
				let value;
				if (indexOfEquals !== -1) {
					key = paramAndValue.slice(0, indexOfEquals);
					value = paramAndValue.slice(indexOfEquals + 1);
				} else {
					key = paramAndValue;
					value = true;
				}

				acc[key] = value;
				return acc;
			}, {});
		}

		return parsedQuery;
	}

	function getMessageData(parsedQuery) {
		try {
			return JSON.parse(window.atob(parsedQuery.data));
		} catch (e) {
			return {};
		}
	}

	if (document.readyState !== 'loading') {
		showMessages();
	} else {
		document.addEventListener('DOMContentLoaded', showMessages);
	}
})()
