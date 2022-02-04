/* 
	Utility classes to prevent the default browser behavior of the
	native HTML disclosure element. Essentially ignore the space
	key to prevent toggling and also the click event when clicking
	in to the operation’s number or description
	
*/

export const disregardSpace = (e) => {
	if (e.keyCode === 32) e.preventDefault();
};

export const disregardAction = (e) => {
	e.preventDefault();
};
