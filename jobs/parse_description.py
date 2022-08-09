type_map = {
    'lineBreak': ('<br/>',),
    'bold': ('<b>', '</b>'),
    'underline': ('<u>', '</u>'),
    'italic': ('<i>', '</i>'),
    'listItem': ('<li>', '</li>'),
    'list': ('<ul>', '</ul>'),
    'olist': ('<ol>', '</ol>'),
    'paragraph': ('<p>', '</p>'),
    'hyperlink': (lambda x: f'<a href="{x}">', '</a>'),
}


def parse_description(attrs, text):
    text = text.replace('\n', '\x20')
    d = {}

    for attr in attrs:
        start = attr['start']
        length = attr['length']
        type_ = list(attr['attributeKindUnion'].keys())[0]
        if type_ == 'list' and attr['attributeKindUnion']['list']['ordered']:
            type_ = 'olist'
        if type_ == 'list':
            d[start] = [type_map[type_][0]] + d.get(start, [])
        elif type_ == 'hyperlink':
            url = attr['attributeKindUnion']['hyperlink']['url']
            d[start] = [type_map[type_][0](url)] + d.get(start, [])
        else:
            d[start] = d.get(start, []) + [type_map[type_][0]]
        if length != 1:
            d[start + length] = d.get(start + length, []) + [type_map[type_][1]]

    d = sorted([[k, v] for k, v in d.items()])

    acc = 0
    for i, tags in d:
        for tag in tags:
            text = text[:i + acc] + tag + text[i + acc:]
            acc += len(tag)

    return text
