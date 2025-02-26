import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Event } from '@/hooks/useEvents';

interface RoundEvaluationProps {
    event: Event;
}

const RoundEvaluation = ({ event }: RoundEvaluationProps) => {
  return (
    <div>
        {event.rounds.map((round, index) => (
            <Card key={index} className="mb-4">
                <CardHeader>
                    <div className='flex justify-between'>
                        <h3 className="text-lg font-semibold">{round.name}</h3>
                        <h3>{round.max_marks} Marks</h3>
                    </div>
                    <div className='text-sm text-gray-500'>
                        {format(round.time, 'PPp')}
                    </div>
                </CardHeader>
                <Separator />
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30px]">S.No</TableHead>
                                <TableHead className="w-[200px]">Category</TableHead>
                                <TableHead className='text-right'>Max Marks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {round.evaluation_pattern.pattern.map((pattern, patternIndex) => (
                                <TableRow key={patternIndex}>
                                    <TableCell className='text-center'>{patternIndex + 1}</TableCell>
                                    <TableCell className="font-medium">{pattern.name}</TableCell>
                                    <TableCell className="text-right">{pattern.max_marks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        ))}
    </div>
  )
}

export default RoundEvaluation