import React, { useState } from 'react'
import { StaticQuery, graphql } from 'gatsby'

import { Quickstart, QS } from '../components/quickstart'

const DEFAULT_LANG = 'en'
const MODELS_SMALL = { en: 'roberta-base-small' }
const MODELS_LARGE = { en: 'roberta-base' }

const COMPONENTS = ['tagger', 'parser', 'ner', 'textcat']
const COMMENT = `# This is an auto-generated partial config for training a model.
# TODO: intructions for how to fill and use it`
const DATA = [
    {
        id: 'lang',
        title: 'Language',
        defaultValue: DEFAULT_LANG,
    },
    {
        id: 'components',
        title: 'Components',
        help: 'Pipeline components to train. Requires training data for those annotations.',
        options: COMPONENTS.map(id => ({ id, title: id })),
        multiple: true,
    },
    {
        id: 'hardware',
        title: 'Hardware',
        options: [
            { id: 'cpu-only', title: 'CPU only' },
            { id: 'cpu', title: 'CPU preferred' },
            { id: 'gpu', title: 'GPU', checked: true },
        ],
    },
    {
        id: 'optimize',
        title: 'Optimize for',
        help: '...',
        options: [
            { id: 'efficiency', title: 'efficiency', checked: true },
            { id: 'accuracy', title: 'accuracy' },
        ],
    },
    {
        id: 'config',
        title: 'Configuration',
        options: [
            {
                id: 'independent',
                title: 'independent components',
                help: "Make components independent and don't share weights",
            },
        ],
        multiple: true,
    },
]

const QuickstartTraining = ({ id, title, download = 'config.cfg' }) => {
    const [lang, setLang] = useState(DEFAULT_LANG)
    const [pipeline, setPipeline] = useState([])
    const setters = { lang: setLang, components: setPipeline }
    return (
        <StaticQuery
            query={query}
            render={({ site }) => {
                const langs = site.siteMetadata.languages
                DATA[0].dropdown = langs.map(({ name, code }) => ({
                    id: code,
                    title: name,
                }))
                return (
                    <Quickstart
                        download={download}
                        data={DATA}
                        title={title}
                        id={id}
                        setters={setters}
                        hidePrompts
                    >
                        <QS comment>{COMMENT}</QS>
                        <span>[nlp]</span>
                        <span>lang = "{lang}"</span>
                        <span>pipeline = {JSON.stringify(pipeline).replace(/,/g, ', ')}</span>
                        <br />
                        <span>[components]</span>
                        <br />
                        <span>[components.transformer]</span>
                        <QS optimize="efficiency">name = "{MODELS_SMALL[lang]}"</QS>
                        <QS optimize="accuracy">name = "{MODELS_LARGE[lang]}"</QS>
                        {!!pipeline.length && <br />}
                        {pipeline.map((pipe, i) => (
                            <>
                                {i !== 0 && <br />}
                                <span>[components.{pipe}]</span>
                                <span>factory = "{pipe}"</span>
                            </>
                        ))}
                    </Quickstart>
                )
            }}
        />
    )
}

const query = graphql`
    query QuickstartTrainingQuery {
        site {
            siteMetadata {
                languages {
                    code
                    name
                }
            }
        }
    }
`

export default QuickstartTraining