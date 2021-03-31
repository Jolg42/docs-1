import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { media } from './styles/media'
import { StaticQuery, graphql, Link } from 'gatsby'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import {
  Menu,
  Close,
  ArrowDropDown,
  ArrowDropRight,
} from '@styled-icons/remix-line'

const _SidenavContainer = styled(ScrollArea.Root)`
  flex-basis: 300px;
  position: sticky;
  top: calc(89px + 4em);
  height: calc(100vh - 89px - 8em);
  border-right: 1px solid var(--bg-primary);
  transition: border-color 100ms linear;
  background: var(--bg-primary);

  > [data-radix-scroll-area-viewport-position]::-webkit-scrollbar {
    -webkit-appearance: none;
    display: none;
    width: 0;
    height: 0;
  }

  &:hover {
    border-right: 1px solid var(--border-primary);
  }

  ${media.tablet`
    border-right: unset;
    max-width: unset;
    position: fixed;
    top: -100vh;
    left: 0;
    z-index: 2;
    padding: 0;
    margin: 0;
    height: 100vh;
    padding: 2em;

    &:hover {
      border-right: unset;
    }

    &.show {
      top: 0;
    }
  `}
`

const StyledScrollbarY = styled(ScrollArea.ScrollbarY)`
  z-index: 2;
  position: absolute;
  user-select: none;
  transition: 300ms opacity ease;
  width: 8;
  right: 0;
  top: 0;
  bottom: 0;
`

const StyledScrollTrack = styled(ScrollArea.Track)`
  z-index: -1;
  position: relative;
  width: 100%;
  height: 100%;
`

const StyledScrollThumb = styled(ScrollArea.Thumb)`
  background-color: var(--text-primary);
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  border-radius: 9999;
  width: 1px;
  height: 8px;
  will-change: top;
`

const MenuLink = styled.div`
  display: none;

  ${media.tablet`
    position: fixed;
    bottom: 16px;
    right: calc(16px + 60px + 16px);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 6px, rgba(0, 0, 0, 0.2) 0px 2px 24px;
    width: 60px;
    height: 60px;
    border-radius: 99px;
    z-index: 3;
    padding: 0 1em;

    > svg {
      width: 24px;
      height: 24px;
    }
  `}
`

const _SidenavList = styled(ScrollArea.Viewport)`
  z-index: 1;
  position: relative;

  ${media.tablet`
    height: 100vh;
  `}
`

const _GroupContainer = styled(Collapsible.Root)``

const _GroupHeading = styled(Collapsible.Button)`
  font-size: 1em;
  letter-spacing: 1px;
  color: var(--text-secondary);
  background-color: unset;
  border: unset;
  padding: 0;
  margin-bottom: 1em;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
  }

  &:active,
  &:focus {
    outline: unset;
    border: unset;
  }

  &[data-state='open'] {
    svg {
      transform: rotate(90deg);
    }
  }
`

const _GroupLinks = styled(Collapsible.Content)`
  padding: 0;
  margin-bottom: 3em;
`

const _PageLink = styled(Link)`
  font-size: 14px;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 1.5em 24px;
  color: var(--text-secondary);
  position: relative;

  &:hover {
    color: var(--link);
  }

  &.active {
    color: var(--text-primary);
    font-weight: 600;
  }
`

function SideNav({ categories, docPages }) {
  const [mobileTOCState, setMobileTOCState] = useState(false)

  const getPagesInCategory = (category, docPages) => {
    const outputPages = []
    category.pages.map((pageID) => {
      docPages.nodes.map((page) => {
        if (page.fields.slug.includes(pageID)) {
          outputPages.push(page)
        }
      })
    })
    return outputPages
  }

  const toggleMobileTOC = () => {
    setMobileTOCState(!mobileTOCState)
  }

  return (
    <Fragment>
      <MenuLink onClick={toggleMobileTOC}>
        {mobileTOCState ? <Close /> : <Menu />}
      </MenuLink>
      <_SidenavContainer className={`${mobileTOCState ? 'show' : ''}`}>
        <_SidenavList>
          <_PageLink onClick={toggleMobileTOC} to="/" activeClassName="active">
            Documentation overview
          </_PageLink>

          {categories.order.map((category, index) => {
            return (
              <SidenavGroup
                key={index}
                category={category.name}
                pages={getPagesInCategory(category, docPages)}
                onClick={toggleMobileTOC}
              ></SidenavGroup>
            )
          })}
        </_SidenavList>

        <StyledScrollbarY>
          <StyledScrollTrack>
            <StyledScrollThumb />
          </StyledScrollTrack>
        </StyledScrollbarY>
      </_SidenavContainer>
    </Fragment>
  )
}

function SidenavGroup({ category, pages, onClick }) {
  return (
    <_GroupContainer defaultOpen={true}>
      <_GroupHeading>
        <ArrowDropRight /> {category}
      </_GroupHeading>
      <_GroupLinks>
        {pages.map((page, index) => {
          return (
            <div key={index}>
              <_PageLink
                onClick={onClick}
                to={`${page.fields.slug}`}
                activeClassName="active"
              >
                {page.frontmatter.title}
              </_PageLink>
            </div>
          )
        })}
      </_GroupLinks>
    </_GroupContainer>
  )
}

const query = graphql`
  query {
    categories: docsYaml {
      order {
        id
        name
        pages
      }
    }

    docPages: allMdx(filter: { frontmatter: { title: { ne: "" } } }) {
      nodes {
        frontmatter {
          title
        }
        fields {
          slug
        }
      }
    }
  }
`

export default () => (
  <StaticQuery
    query={query}
    render={(data) => {
      return (
        <SideNav
          categories={data.categories}
          docPages={data.docPages}
        ></SideNav>
      )
    }}
  ></StaticQuery>
)
