function activate(context) {

	const htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	}

	function escapeHtml(html) {
		return html.replace(/[&<>"']/g, chr => htmlEscapes[chr])
	}

	function getRenderFunction(type, arg_reg) {
		return (tokens, idx) => {
			if (tokens[idx].nesting === 1) {
				// opening tag
				let title = tokens[idx].info.trim().match(arg_reg)[1];
				title = escapeHtml(title);
				// return `<div class="custom-block ${type}">${title ? `\n<p class="custom-block-title">${title}</p>` : ''}\n`;
				return `<div class="custom-block">${title ? `\n<p class="custom-block-title">${title}</p>` : ''}\n`;
			} else {
				// closing tag
				return '</div>\n';
			}
		};
	}

	function getRenderOptions(type) {
		// const ARG_REG = new RegExp(`^${type}\\s*(.*?)$`);
		const ARG_REG = new RegExp(`^\\{([^\\r\\n]+)\\}$`);
		return {
			validate: (params) => params.trim().match(ARG_REG) !== null,
			render: getRenderFunction(type, ARG_REG)
		}
	}

	return {
		extendMarkdownIt(md) {
			const containerTypes = [''];
			const mdc = require('markdown-it-container');
			containerTypes.forEach(type => {
				md = md.use(mdc, type, getRenderOptions(type));
			});
			return md;
		}
	};
}

exports.activate = activate;
