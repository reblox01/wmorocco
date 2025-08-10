import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/app/components/Button';

describe('Button component', () => {
  it('renders label and handles click', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
