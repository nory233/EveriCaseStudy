import type { ReactNode } from 'react'

export type NavPage = 'home' | 'patients' | 'clinical-encounter'

interface AppSidebarProps {
  activePage: NavPage
  open: boolean
  onNavigate: (page: NavPage) => void
  onClose: () => void
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3.5 19c0-2.8 2.4-5 5.5-5s5.5 2.2 5.5 5" />
      <path d="M14 19c.3-1.8 1.7-3.2 3.5-3.5" />
    </svg>
  )
}

function IconMic() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4M9 21h6" />
    </svg>
  )
}

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3.5h7l3 3V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V7h3M9 12h6M9 16h6" />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 4v5h-5" />
    </svg>
  )
}

function IconAudit() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4 3v-3.2A2.5 2.5 0 0 1 5 13.5v-7Z" />
    </svg>
  )
}

type NavItem =
  | { id: NavPage; label: string; icon: ReactNode }
  | { id: 'placeholder'; label: string; icon: ReactNode }

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Home',
    items: [
      { id: 'home', label: 'Home', icon: <IconHome /> },
      { id: 'patients', label: 'Patients', icon: <IconUsers /> },
    ],
  },
  {
    label: 'Clinical Workflow',
    items: [
      { id: 'clinical-encounter', label: 'Clinical Encounter', icon: <IconMic /> },
      { id: 'placeholder', label: 'AI Transcription', icon: <IconDoc /> },
      { id: 'placeholder', label: 'Forms', icon: <IconGrid /> },
    ],
  },
  {
    label: 'Insurance',
    items: [
      { id: 'placeholder', label: 'Claim Review', icon: <IconCheck /> },
      { id: 'placeholder', label: 'Appeal Management', icon: <IconRefresh /> },
      { id: 'placeholder', label: 'Audit Management', icon: <IconAudit /> },
    ],
  },
  {
    label: 'Assistant & Organization',
    items: [
      { id: 'placeholder', label: 'LCD Code Lookup', icon: <IconAudit /> },
      { id: 'placeholder', label: 'ChatBot', icon: <IconChat /> },
    ],
  },
]

export function AppSidebar({
  activePage,
  open,
  onNavigate,
  onClose,
}: AppSidebarProps) {
  function handleNavigate(page: NavPage) {
    onNavigate(page)
    onClose()
  }

  return (
    <>
      <div
        className={`sidebar-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`sidebar${open ? ' open' : ''}`} id="app-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-user">
            <div className="sidebar-avatar" aria-hidden>
              N
            </div>
            <div>
              <strong>Noor</strong>
              <span>Everi Labs</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Product navigation">
          {sections.map((section) => (
            <div key={section.label} className="sidebar-section">
              <p className="sidebar-section-label">{section.label}</p>
              <ul>
                {section.items.map((item) => {
                  const key = `${section.label}-${item.label}`
                  if (item.id === 'placeholder') {
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          className="nav-item"
                          disabled
                          title="Not in this prototype"
                        >
                          <span className="nav-icon">{item.icon}</span>
                          {item.label}
                        </button>
                      </li>
                    )
                  }
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className={`nav-item${activePage === item.id ? ' active' : ''}`}
                        aria-current={activePage === item.id ? 'page' : undefined}
                        onClick={() => handleNavigate(item.id)}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <p className="sidebar-footnote">Prototype · mock data only</p>
      </aside>
    </>
  )
}
