(function (root) {
  const SHEET_ID = '19CSsMgs43vau4l1bab4CXTPRjnx3NS5E9P4p7TxswFU';
  const SHEET_GID = '1652413690';
  const REFRESH_MS = 5 * 60 * 1000;

  const TAXONOMY = {
    instruments: [
      { short: 'Piano', full: 'Piano / Keys — Դաշնամուր / ստեղնաշարային', keys: ['piano', 'piano / keys', 'keys', 'դաշնամուր', 'ստեղնաշարային', 'դաշնամուր / ստեղնաշարային'] },
      { short: 'Strings', full: 'Strings — Լարային գործիքներ', keys: ['strings', 'string', 'լարային', 'լարային գործիքներ'] },
      { short: 'Wind', full: 'Wind instruments — Փողային գործիքներ', keys: ['wind', 'wind instruments', 'փողային', 'փողային գործիքներ'] },
      { short: 'Percussion', full: 'Percussion — Հարվածային գործիքներ', keys: ['percussion', 'հարվածային', 'հարվածային գործիքներ'] },
      { short: 'Voice', full: 'Voice — Ձայն / վոկալ', keys: ['voice', 'vocal', 'vocals', 'ձայն', 'վոկալ', 'ձայն / վոկալ'] },
      { short: 'Electronic', full: 'Electronic instruments — Էլեկտրոնային գործիքներ', keys: ['electronic instruments', 'էլեկտրոնային գործիքներ'] },
      { short: 'Laptop', full: 'Laptop / DAW — Համակարգիչ / DAW', keys: ['laptop', 'laptop / daw', 'daw', 'համակարգիչ', 'համակարգիչ / daw'] },
      { short: 'Other', full: 'Other — Այլ', keys: ['other', 'այլ'] }
    ],
    styles: [
      { short: 'Classical', full: 'Classical — Դասական', keys: ['classical', 'դասական'] },
      { short: 'Jazz', full: 'Jazz — Ջազ', keys: ['jazz', 'ջազ'] },
      { short: 'Electronic', full: 'Electronic — Էլեկտրոնային', keys: ['electronic', 'էլեկտրոնային'] },
      { short: 'Experimental', full: 'Experimental — Փորձարարական', keys: ['experimental', 'փորձարարական'] },
      { short: 'Ambient', full: 'Ambient — Ամբիենթ', keys: ['ambient', 'ամբիենթ', 'ambient'] },
      { short: 'Pop', full: 'Pop — Փոփ', keys: ['pop', 'փոփ'] },
      { short: 'Rock', full: 'Rock — Ռոք', keys: ['rock', 'ռոք'] },
      { short: 'Hip-hop', full: 'Hip-hop / R&B — Հիփ-հոփ / R&B', keys: ['hip-hop', 'hip hop', 'hip-hop / r&b', 'r&b', 'rnb', 'հիփ-հոփ', 'հիփ-հոփ / r&b'] },
      { short: 'Folk', full: 'Folk / Traditional — Ժողովրդական / ավանդական', keys: ['folk', 'folk / traditional', 'traditional', 'ժողովրդական', 'ավանդական', 'ժողովրդական / ավանդական'] },
      { short: 'Other', full: 'Other — Այլ', keys: ['other', 'այլ'] }
    ],
    interests: [
      { short: 'Production', full: 'Music production — Երաժշտական պրոդաքշն', keys: ['music production', 'production', 'երաժշտական պրոդաքշն', 'պրոդաքշն'] },
      { short: 'Sound', full: 'Sound design — Ձայնային դիզայն', keys: ['sound design', 'sound', 'ձայնային դիզայն'] },
      { short: 'Composition', full: 'Composition — Կոմպոզիցիա', keys: ['composition', 'կոմպոզիցիա'] },
      { short: 'Recording', full: 'Recording & mixing — Ձայնագրություն և միքսինգ', keys: ['recording & mixing', 'recording', 'mixing', 'ձայնագրություն և միքսինգ', 'ձայնագրություն', 'միքսինգ'] },
      { short: 'Electronic', full: 'Electronic music — Էլեկտրոնային երաժշտություն', keys: ['electronic music', 'էլեկտրոնային երաժշտություն'] },
      { short: 'Live', full: 'Live performance — Կենդանի կատարում', keys: ['live performance', 'live', 'կենդանի կատարում', 'կենդանի'] },
      { short: 'Film', full: 'Music for film & games — Երաժշտություն ֆիլմերի և խաղերի համար', keys: ['music for film & games', 'music for film', 'film', 'games', 'երաժշտություն ֆիլմերի և խաղերի համար'] },
      { short: 'Independent', full: 'Independent artist practice — Անկախ արտիստական պրակտիկա', keys: ['independent artist practice', 'independent', 'անկախ արտիստական պրակտիկա', 'անկախ'] }
    ]
  };

  const INDEX = {};
  Object.keys(TAXONOMY).forEach(category => {
    const entries = [];
    TAXONOMY[category].forEach(opt => {
      const bag = new Set([opt.short, opt.full, ...(opt.keys || [])]);
      String(opt.full).split(/\s*[—–\-]\s*/).forEach(part => bag.add(part));
      bag.forEach(key => {
        const n = norm(key);
        if (n) entries.push({ n, opt });
      });
    });
    entries.sort((a, b) => b.n.length - a.n.length);
    INDEX[category] = entries;
  });

  function norm(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[\u2010-\u2015\u2212]/g, '-')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function hashId(value) {
    const n = norm(value);
    let h = 2166136261;
    for (let i = 0; i < n.length; i++) {
      h ^= n.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function nameNodeId(name) {
    const slug = norm(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
    return 'artist::' + (slug || ('n' + hashId(name)));
  }

  function parseCsv(text) {
    const source = String(text || '').replace(/^\uFEFF/, '');
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < source.length; i++) {
      const c = source[i];
      if (inQuotes) {
        if (c === '"') {
          if (source[i + 1] === '"') {
            cell += '"';
            i += 1;
          } else {
            inQuotes = false;
          }
        } else {
          cell += c;
        }
        continue;
      }
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(cell);
        cell = '';
      } else if (c === '\n') {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else if (c !== '\r') {
        cell += c;
      }
    }
    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }
    return rows.filter(r => r.some(value => String(value || '').trim()));
  }

  function splitMulti(raw) {
    if (raw == null) return [];
    if (Array.isArray(raw)) return raw.flatMap(splitMulti);
    const source = String(raw).trim();
    if (!source) return [];
    if (source.startsWith('[') && source.endsWith(']')) {
      try {
        const parsed = JSON.parse(source);
        if (Array.isArray(parsed)) return parsed.flatMap(splitMulti);
      } catch (err) { /* keep the raw text */ }
    }
    return source.split(/\s*(?:,|;|\||\n|•)\s*/).map(part => part.trim()).filter(Boolean);
  }

  function columnKind(header) {
    const s = norm(header);
    if (!s) return null;
    if (s === 'name' || s.startsWith('name ') || s.startsWith('name|') || s.includes('անուն')) return 'name';
    if (s.includes('telegram')) return 'telegram';
    if (s.includes('instagram')) return 'instagram';
    if (s.includes('instrument') || s.includes('գործիք')) return 'instruments';
    if (s.includes('style') || s.includes('ոճ')) return 'styles';
    if (s.includes('interest') || s.includes('explor') || s.includes('հետաքրք')) return 'interests';
    if (s.includes('share') || s.includes('portfolio') || s.includes('social media') || s.includes('աշխատանք')) return 'work';
    if (s.includes('submitted')) return 'submitted';
    return null;
  }

  function firstCell(row, indexes) {
    for (let i = 0; i < indexes.length; i++) {
      const value = String(row[indexes[i]] || '').trim();
      if (value) return value;
    }
    return '';
  }

  function joinCells(row, indexes) {
    return indexes.map(index => String(row[index] || '').trim()).filter(Boolean).join(', ');
  }

  function cleanHandle(raw) {
    let value = String(raw || '').trim();
    if (!value) return '';
    value = value.replace(/^@+/, '');
    if (/^(t\.me|telegram\.me|instagram\.com|www\.instagram\.com)\//i.test(value)) {
      value = 'https://' + value;
    }
    if (/^https?:\/\//i.test(value)) {
      try {
        const url = new URL(value);
        const parts = url.pathname.split('/').filter(Boolean);
        value = parts[0] || '';
      } catch (err) {
        value = value.split(/[/?#\s]/)[0];
      }
    }
    value = value.replace(/^@+/, '').split(/[/?#\s]/)[0].trim();
    if (!value || /^https?:$/i.test(value)) return '';
    return value;
  }

  function firstUrl(raw) {
    const source = String(raw || '').trim();
    if (!source) return '';
    const match = source.match(/https?:\/\/[^\s,]+/i);
    if (match) return match[0].replace(/[).,]+$/, '');
    if (/^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(source)) return 'https://' + source;
    return '';
  }

  function startsWithKey(value, key) {
    if (value === key) return true;
    return value.startsWith(key + ' ') || value.startsWith(key + '-') || value.startsWith(key + ' -');
  }

  function classify(category, raw) {
    const original = String(raw || '').trim();
    const n = norm(original);
    if (!n) return null;
    const entries = INDEX[category] || [];
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].n === n) return { id: category + '::' + entries[i].opt.short, short: entries[i].opt.short, full: entries[i].opt.full, note: '' };
    }
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].n.length < 3) continue;
      if (startsWithKey(n, entries[i].n)) {
        return { id: category + '::' + entries[i].opt.short, short: entries[i].opt.short, full: entries[i].opt.full, note: '' };
      }
    }
    const other = n.match(/^(other|այլ)\s*[:\-]?\s*(.*)$/);
    if (other) {
      const rest = norm(other[2]);
      const plain = !rest || rest === 'other' || rest === 'այլ' || rest === 'other - այլ';
      const note = plain ? '' : original.replace(/^(other|Other|OTHER|այլ|Այլ|ԱՅԼ)\s*[:\-–—]?\s*/, '').trim();
      return {
        id: category + '::Other',
        short: 'Other',
        full: 'Other — Այլ',
        note: note && norm(note) !== 'այլ' && norm(note) !== 'other' ? note : ''
      };
    }
    const id = category + '::c' + hashId(original);
    return { id, short: shortCustom(original), full: original, note: '' };
  }

  function shortCustom(text) {
    const raw = String(text || '').trim();
    const parts = raw.split(/\s*[—–\-]\s*/).map(part => part.trim()).filter(Boolean);
    let base = parts[0] || raw;
    if (base.length > 22) {
      const words = base.split(/\s+/).slice(0, 2).join(' ');
      base = words.length > 22 ? words.slice(0, 20).trim() + '…' : words;
    }
    return base || 'Other';
  }

  function uniqueTags(tags) {
    const seen = new Set();
    const out = [];
    tags.forEach(tag => {
      if (!tag || seen.has(tag.id)) return;
      seen.add(tag.id);
      out.push(tag);
    });
    return out;
  }

  function tagsFrom(category, raw) {
    return uniqueTags(splitMulti(raw).map(value => classify(category, value)).filter(Boolean));
  }

  function gvizCell(cell) {
    if (!cell) return '';
    const value = cell.v;
    if (typeof value === 'string' && value.indexOf('Date(') === 0 && cell.f != null) return String(cell.f);
    if (value == null || value === '') return cell.f != null ? String(cell.f) : '';
    return String(value);
  }

  function buildGraphFromGviz(response) {
    if (!response || response.status !== 'ok' || !response.table) {
      const error = new Error('The sheet response was not usable.');
      error.badHeader = true;
      throw error;
    }
    const labels = (response.table.cols || []).map(col => (col && col.label) ? String(col.label) : '');
    const body = (response.table.rows || []).map(row => ((row && row.c) || []).map(gvizCell));
    const headerInColumns = labels.some(label => columnKind(label));
    return buildGraphFromTable(headerInColumns ? [labels].concat(body) : body);
  }

  function buildGraphFromCsv(csvText) {
    return buildGraphFromTable(parseCsv(csvText));
  }

  function buildGraphFromTable(table) {
    if (!table.length) {
      const error = new Error('The sheet is empty.');
      error.empty = true;
      throw error;
    }
    const header = table[0];
    const columns = { name: [], telegram: [], instagram: [], instruments: [], styles: [], interests: [], work: [], submitted: [] };
    header.forEach((cell, index) => {
      const kind = columnKind(cell);
      if (kind) columns[kind].push(index);
    });
    if (!columns.name.length) {
      const error = new Error('The sheet has no Name column.');
      error.badHeader = true;
      throw error;
    }

    const people = new Map();
    for (let r = 1; r < table.length; r++) {
      const row = table[r];
      const name = firstCell(row, columns.name).replace(/\s+/g, ' ').trim();
      if (!name || norm(name) === 'name') continue;
      const submittedRaw = firstCell(row, columns.submitted);
      const submitted = Date.parse(submittedRaw);
      const record = {
        name,
        telegram: cleanHandle(firstCell(row, columns.telegram)),
        instagram: cleanHandle(firstCell(row, columns.instagram)),
        work: firstCell(row, columns.work),
        workUrl: firstUrl(firstCell(row, columns.work)),
        submitted: Number.isNaN(submitted) ? r : submitted,
        tags: {
          instruments: tagsFrom('instruments', joinCells(row, columns.instruments)),
          styles: tagsFrom('styles', joinCells(row, columns.styles)),
          interests: tagsFrom('interests', joinCells(row, columns.interests))
        }
      };
      const key = norm(name);
      const previous = people.get(key);
      if (!previous || record.submitted >= previous.submitted) people.set(key, record);
    }

    const nodes = [];
    const links = [];
    const artists = {};
    const seenNodes = new Set();
    const seenLinks = new Set();
    const fullLabels = {};
    const filterOptions = { instruments: [], styles: [], interests: [] };
    const seenFilters = { instruments: new Set(), styles: new Set(), interests: new Set() };

    people.forEach(person => {
      const id = nameNodeId(person.name);
      artists[id] = person;
      if (!seenNodes.has(id)) {
        seenNodes.add(id);
        nodes.push({ id, label: person.name, fullLabel: person.name, group: 'artist' });
      }
      ['instruments', 'styles', 'interests'].forEach(category => {
        person.tags[category].forEach(tag => {
          if (!seenNodes.has(tag.id)) {
            seenNodes.add(tag.id);
            nodes.push({
              id: tag.id,
              label: tag.short,
              fullLabel: tag.full,
              group: category
            });
            fullLabels[tag.id] = tag.full;
          }
          if (!seenFilters[category].has(tag.id)) {
            seenFilters[category].add(tag.id);
            filterOptions[category].push({ value: tag.id, label: tag.short, title: tag.full });
          }
          const linkKey = id + '>' + tag.id;
          if (!seenLinks.has(linkKey)) {
            seenLinks.add(linkKey);
            links.push({ source: id, target: tag.id });
          }
        });
      });
    });

    return {
      nodes,
      links,
      artists,
      filter_options: filterOptions,
      filter_order: ['instruments', 'styles', 'interests'],
      fullLabels
    };
  }

  function sheetCsvUrls() {
    const base = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:csv';
    return [base + '&gid=' + SHEET_GID, base];
  }

  function sheetJsonUrls() {
    const base = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json';
    return [base + '&gid=' + SHEET_GID, base];
  }

  function dataSignature(data) {
    if (!data) return '';
    const nodes = data.nodes.map(node => [node.id, node.label, node.fullLabel, node.group].join('|')).sort();
    const links = data.links.map(link => link.source + '>' + link.target).sort();
    const artists = Object.keys(data.artists).sort().map(id => {
      const artist = data.artists[id];
      return [id, artist.name, artist.telegram, artist.instagram, artist.work, JSON.stringify(artist.tags)].join('|');
    });
    return nodes.join('\n') + '\n' + links.join('\n') + '\n' + artists.join('\n');
  }

  root.StudentMapping = {
    SHEET_ID,
    SHEET_GID,
    REFRESH_MS,
    buildGraphFromCsv,
    buildGraphFromGviz,
    parseCsv,
    sheetCsvUrls,
    sheetJsonUrls,
    dataSignature,
    cleanHandle,
    classify
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
