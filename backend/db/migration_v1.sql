-- Add sort_order to tasks for drag-to-reorder
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

-- Seed initial order from insertion order (id) so existing tasks keep their order
UPDATE tasks SET sort_order = id WHERE sort_order = 0;
