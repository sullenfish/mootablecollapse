/**
 * @author Frederick J. Ostrander
 * @version 0.4
 * @copyright Copyright (c) 2009 Frederick J. Ostrander
 * @license MIT Style License
 */
var MooTableCollapse = new Class({
	Implements: [Events, Options],
	options: {
		collapsed: true,
		'exposed-rows': 1,
		'footer-text': {
			collapsed: 'Click to Expand',
			expanded: 'Click to Collapse'
		},
		onToggle: function(){
			this.toggle();
		}
	},
	initialize: function(element, options){
		this.setOptions(options);
		this.collapsed = this.options.collapsed;
		this.exposedRows = this.options['exposed-rows'] >= 0 ? this.options['exposed-rows'] : 0;
		this.footerText = this.options['footer-text'];
		this.table = $(element);
		this.head = this.table.getElement('thead');
		this.body = this.table.getElement('tbody');
		this.rows = this.body.getElements('tr').filter(function(item, index){
			return index + 1 > this.exposedRows;
		}, this);
		this.foot = this.table.getElement('tfoot');
		this.body.getElements('td').set('morph', {
			duration: 500,
			unit: 'px'
		});
		this.foot.getElement('td').set('tween', {
			duration: 250
		});
		if (this.collapsed) {
			this.rows.each(function(row){
				row.getElements('td').addClass('collapsed');
				row.getElements('td').morph({
					'border-bottom-width': [0, 0],
					'border-top-width': [0, 0],
					'height': [0, 0],
					'line-height': [0, 0],
					'opacity': [0.01, 0]
				}); // stupid kludge
			});
			if (!Browser.Engine.gecko) {
				this.rows.setStyle('display', 'none');
			}
			this.foot.getElement('td').set('html', this.footerText.collapsed);
		}
		else {
			this.rows.each(function(row){
				row.getElements('td').addClass('expanded');
				row.getElements('td').morph({
					'border-bottom-width': [1, 1],
					'border-top-width': [1, 1],
					'height': [24, 24],
					'line-height': [24, 24]
				}); // stupid kludge				
			});
			this.foot.getElement('td').set('html', this.footerText.expanded);
		}
		this.foot.addEvent('click', (function(){
			this.fireEvent('toggle');
		}).bind(this));
	},
	toggle: function(){
		this.collapsed = !this.collapsed;
		if (this.collapsed){
			this.rows.each(function(row){
				row.getElements('td').morph('td.collapsed');
			});
			if (!Browser.Engine.gecko) {
				(function(){
					this.rows.each(function(row){
						row.setStyle('display', 'none');
					}, this);
				}).delay(500, this);
			}
			this.foot.getElement('td').fade('out');
			(function(){
				this.foot.getElement('td').set('html', this.footerText.collapsed);
				this.foot.getElement('td').fade('in');				
			}).delay(250, this);
		}
		else {
			if (!Browser.Engine.gecko) {
				this.rows.each(function(row){
					row.setStyle('display', Browser.Engine.trident ? 'block' : 'table-row');
				}, this);
			}
			this.rows.each(function(row){
				row.getElements('td').morph('td.expanded');				
			});
			this.foot.getElement('td').fade('out');
			(function(){
				this.foot.getElement('td').set('html', this.footerText.expanded);
				this.foot.getElement('td').fade('in');				
			}).delay(250, this);
		}
	}
});