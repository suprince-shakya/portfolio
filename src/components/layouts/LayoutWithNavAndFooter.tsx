import '@/app/globals.css';

import { PropsWithChildren } from 'react';
import { Toaster } from '../ui/toaster';

const LayoutWithNavAndFooter: React.FC<
	PropsWithChildren & {
		hideFooter?: boolean;
	}
> = (props) => {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-grow">{props.children}</div>
			<Toaster />
		</div>
	);
};

export default LayoutWithNavAndFooter;
