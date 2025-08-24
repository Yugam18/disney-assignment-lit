import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { SearchFilters } from '../types/index.js';

@customElement('filter-panel')
export class FilterPanel extends LitElement {
    @property({ type: Object }) filters: SearchFilters = {};
    @property({ type: Function }) onFiltersChange: (filters: SearchFilters) => void = () => {};

    @state() private expandedCategories = new Set<string>();

    // Sample filter options - limited to 5 per category
    private filterOptions = {
        films: [
            'The Lion King',
            'Cinderella',
            'Sleeping Beauty',
            'Gravity Falls',
            'Beauty and the Beast',
            'The Fox and the Hound'
        ],
        tvShows: [
            'Hercules',
            'Aladdin (TV series)',
            'DuckTales',
            'The Owl House',
            'Amphibia'
        ],
        videoGames: [
            'Kingdom Hearts',
            'Disney Infinity',
            'Disney Dreamlight Valley',
            'Disney Speedstorm',
            'Disney Magical World'
        ]
    };

    static styles = css`
        :host {
            display: block;
            width: 280px;
            position: sticky;
            top: 100px;
        }

        .filter-sidebar {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
            max-height: calc(100vh - 120px);
            overflow-y: auto;
            margin-top: 20px;
        }

        .filter-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 1.5rem 0;
            text-align: center;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
        }

        .filter-category {
            margin-bottom: 1.5rem;
        }

        .category-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .category-title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
            color: #374151;
            font-size: 1rem;
        }

        .expand-icon {
            width: 24px;
            height: 24px;
            border: 2px solid #3b82f6;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: white;
        }

        .expand-icon.expanded {
            background: #3b82f6;
            color: white;
        }

        .category-options {
            max-height: 0;
            overflow: hidden;
            margin-top: 0.5rem;
        }

        .category-options.expanded {
            max-height: 300px;
        }

        .filter-option {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 0;
            cursor: pointer;
            border-radius: 6px;
            padding-left: 0.5rem;
        }

        .checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid #d1d5db;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: white;
        }

        .checkbox.checked {
            background: #3b82f6;
            border-color: #3b82f6;
        }

        .checkbox.checked::after {
            content: '✓';
            color: white;
            font-size: 12px;
            font-weight: bold;
        }

        .option-label {
            font-size: 0.875rem;
            color: #4b5563;
            cursor: pointer;
            flex: 1;
        }

        .filter-actions {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 2px solid #e5e7eb;
        }

        .filter-button {
            width: 100%;
            padding: 0.75rem 1rem;
            border: none;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            margin-bottom: 0.75rem;
        }

        .clear-filters {
            background: #6b7280;
            color: white;
        }

        @media (max-width: 1024px) {
            :host {
                width: 100%;
                position: static;
            }
            
            .filter-sidebar {
                margin-bottom: 2rem;
            }
        }
    `;

    private toggleCategory(category: string) {
        if (this.expandedCategories.has(category)) {
            this.expandedCategories.delete(category);
        } else {
            this.expandedCategories.add(category);
        }
        this.requestUpdate();
    }

    private toggleFilterOption(field: keyof SearchFilters, value: string) {
        const currentValues = this.filters[field] as string[] || [];
        let newValues: string[];

        if (currentValues.includes(value)) {
            // Remove value
            newValues = currentValues.filter((v: string) => v !== value);
        } else {
            // Add value
            newValues = [...currentValues, value];
        }

        this.filters = { ...this.filters, [field]: newValues };
        this.requestUpdate();
        this.onFiltersChange(this.filters);
    }

    private isOptionSelected(field: keyof SearchFilters, value: string): boolean {
        return ((this.filters[field] as string[]) || []).includes(value);
    }

    private clearFilters() {
        this.filters = {};
        this.requestUpdate();
        this.onFiltersChange(this.filters);
    }

    private getSelectedCount(field: keyof SearchFilters): number {
        return ((this.filters[field] as string[]) || []).length;
    }

    render() {
        return html`
            <div class="filter-sidebar">
                <h3 class="filter-title">Filters</h3>
                
                <!-- Films Category -->
                <div class="filter-category">
                    <div class="category-header" @click="${() => this.toggleCategory('films')}">
                        <div class="category-title">
                            Films
                            ${this.getSelectedCount('films') > 0 ? html`<span style="color: #3b82f6; font-size: 0.75rem;">(${this.getSelectedCount('films')})</span>` : ''}
                        </div>
                        <div class="expand-icon ${this.expandedCategories.has('films') ? 'expanded' : ''}">
                            ${this.expandedCategories.has('films') ? '−' : '+'}
                        </div>
                    </div>
                    <div class="category-options ${this.expandedCategories.has('films') ? 'expanded' : ''}">
                        ${this.filterOptions.films.map(film => html`
                            <div class="filter-option" @click="${() => this.toggleFilterOption('films', film)}">
                                <div class="checkbox ${this.isOptionSelected('films', film) ? 'checked' : ''}"></div>
                                <span class="option-label">${film}</span>
                            </div>
                        `)}
                    </div>
                </div>

                <!-- TV Shows Category -->
                <div class="filter-category">
                    <div class="category-header" @click="${() => this.toggleCategory('tvShows')}">
                        <div class="category-title">
                            TV Shows
                            ${this.getSelectedCount('tvShows') > 0 ? html`<span style="color: #3b82f6; font-size: 0.75rem;">(${this.getSelectedCount('tvShows')})</span>` : ''}
                        </div>
                        <div class="expand-icon ${this.expandedCategories.has('tvShows') ? 'expanded' : ''}">
                            ${this.expandedCategories.has('tvShows') ? '−' : '+'}
                        </div>
                    </div>
                    <div class="category-options ${this.expandedCategories.has('tvShows') ? 'expanded' : ''}">
                        ${this.filterOptions.tvShows.map(show => html`
                            <div class="filter-option" @click="${() => this.toggleFilterOption('tvShows', show)}">
                                <div class="checkbox ${this.isOptionSelected('tvShows', show) ? 'checked' : ''}"></div>
                                <span class="option-label">${show}</span>
                            </div>
                        `)}
                    </div>
                </div>

                <!-- Video Games Category -->
                <div class="filter-category">
                    <div class="category-header" @click="${() => this.toggleCategory('videoGames')}">
                        <div class="category-title">
                            Video Games
                            ${this.getSelectedCount('videoGames') > 0 ? html`<span style="color: #3b82f6; font-size: 0.75rem;">(${this.getSelectedCount('videoGames')})</span>` : ''}
                        </div>
                        <div class="expand-icon ${this.expandedCategories.has('videoGames') ? 'expanded' : ''}">
                            ${this.expandedCategories.has('videoGames') ? '−' : '+'}
                        </div>
                    </div>
                    <div class="category-options ${this.expandedCategories.has('videoGames') ? 'expanded' : ''}">
                        ${this.filterOptions.videoGames.map(game => html`
                            <div class="filter-option" @click="${() => this.toggleFilterOption('videoGames', game)}">
                                <div class="checkbox ${this.isOptionSelected('videoGames', game) ? 'checked' : ''}"></div>
                                <span class="option-label">${game}</span>
                            </div>
                        `)}
                    </div>
                </div>

                <div class="filter-actions">
                    <button 
                        class="filter-button clear-filters"
                        @click="${this.clearFilters}"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>
        `;
    }
}
